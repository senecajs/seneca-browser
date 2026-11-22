/* Copyright (c) Richard Rodger 2019-2026, MIT license. */

// The browser transport against a real gateway: an express server with
// @seneca/gateway and @seneca/gateway-express, on a free port of
// 127.0.0.1. The client is the BUILT bundle, seneca-browser.js, and sends
// its messages with the global fetch of Node.js.

const { test, before, after } = require('node:test')
const assert = require('node:assert')

const Express = require('express')
const SenecaNode = require('seneca')

const Seneca = require('../seneca-browser.js')

let server
let base
let backend

before(async () => {
  backend = SenecaNode({ legacy: false, log: 'silent' })
    .use('@seneca/gateway', { error: { message: true, details: true } })
    .use('@seneca/gateway-express', { error: { next: false } })
    .use('@seneca/gateway$mapper', { error: { message: true } })
    .use('@seneca/gateway-express$mapper', { error: { next: false } })
    .message('a:1', async function a1(msg) {
      return { x: 1 + msg.x }
    })
    .add('c:1', function c1(msg, reply) {
      reply(new Error('c1-failed'))
    })
    .add('c:2', function c2(msg, reply) {
      this.fail('c2-code', { x: msg.x })
    })
    .message('h:1', async function h1(msg) {
      return { auth: msg.gateway.headers['x-auth'] }
    })
    .message('e:1', async function e1(msg) {
      return { x: 10 + msg.x, end: msg.gateway.params.end }
    })

  await backend.ready()

  const app = Express()
  app
    .use(Express.json())
    .post('/seneca', backend.export('gateway-express/handler'))
    .post('/api/seneca', backend.export('gateway-express/handler'))
    .post('/api/mapper/:end', backend.export('gateway-express$mapper/handler'))

  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', resolve).on('error', reject)
  })
  base = 'http://127.0.0.1:' + server.address().port
})

after(async () => {
  if (server) {
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
  }
  if (backend) {
    await backend.close()
  }
})

function client(browserOptions, pin) {
  return Seneca({
    log: 'silent',
    timeout: 2222,
    plugin: { browser: browserOptions },
  }).client({ type: 'browser', pin: pin || ['a:*', 'c:*', 'h:*'] })
}

test('remote-round-trip', async () => {
  const seneca = client({ endpoint: base + '/seneca' })
  await seneca.ready()

  assert.deepEqual(await seneca.post('a:1', { x: 1 }), { x: 2 })

  const out = await new Promise((resolve, reject) =>
    seneca.act('a:1,x:2', (err, out) => (err ? reject(err) : resolve(out))),
  )
  assert.deepEqual(out, { x: 3 })

  await seneca.close()
})

test('remote-error', async () => {
  const seneca = client({ endpoint: base + '/seneca' })
  await seneca.ready()

  // rc3 and rc4 crashed here, in the error line of eraro.
  const err = await new Promise((resolve) =>
    seneca.act('c:1', (err, out) => resolve(err || new Error('no error'))),
  )
  assert.equal(err.message.includes('c1-failed'), true)

  await assert.rejects(seneca.post('c:2', { x: 1 }), (err) => {
    assert.equal(err.code, 'c2-code')
    return true
  })

  // The client is still usable after remote errors.
  assert.deepEqual(await seneca.post('a:1', { x: 3 }), { x: 4 })

  await seneca.close()
})

test('remote-headers', async () => {
  const seneca = client({
    endpoint: base + '/seneca',
    headers: { 'X-Auth': async () => 'token-1' },
  })
  await seneca.ready()

  assert.deepEqual(await seneca.post('h:1'), { auth: 'token-1' })

  await seneca.close()
})

test('remote-endpoint-function', async () => {
  const seen = []
  const seneca = client({
    endpoint: function (msg, config) {
      seen.push(msg.a, config.method)
      return base + '/api/seneca'
    },
  })
  await seneca.ready()

  assert.deepEqual(await seneca.post('a:1', { x: 4 }), { x: 5 })
  assert.deepEqual(seen, [1, 'post'])

  await seneca.close()
})

test('remote-pathmap', async () => {
  const seneca = client(
    {
      endpoint: base + '/api/mapper',
      pathmap: {
        'e:1,p:foo': { suffix: '/foo' },
        'e:1,p:*': { suffix: (msg) => '/' + msg.p + '-fn' },
      },
    },
    ['e:*'],
  )
  await seneca.ready()

  assert.deepEqual(await seneca.post('e:1,p:foo', { x: 1 }), {
    x: 11,
    end: 'foo',
  })
  assert.deepEqual(await seneca.post('e:1,p:bar', { x: 2 }), {
    x: 12,
    end: 'bar-fn',
  })

  await seneca.close()
})
