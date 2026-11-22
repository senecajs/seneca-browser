/* Copyright (c) Richard Rodger 2019-2026, MIT license. */

// These tests load the BUILT bundle, seneca-browser.js, in Node.js. Run
// `npm run build` first to test changes to seneca-browser-src.js.

const { test } = require('node:test')
const assert = require('node:assert')

const Pkg = require('../package.json')
const Seneca = require('../seneca-browser.js')

function make(options) {
  return Seneca({ log: 'silent', ...options })
}

test('bundle-exports', () => {
  assert.equal(typeof Seneca, 'function')
  assert.equal(Seneca.browser.version, Pkg.version)
  assert.equal(typeof Seneca.util.Jsonic, 'function')
  assert.equal(typeof Seneca.util.Patrun, 'function')
  assert.equal(typeof Seneca.valid, 'function')
})

test('embedded-core', async () => {
  const seneca = make()
  await seneca.ready()
  assert.equal(seneca.version, Pkg.devDependencies.seneca)
  assert.ok(seneca.has_plugin('browser'))
  assert.ok(seneca.has('role:transport,hook:client,type:browser'))
  await seneca.close()
})

test('local-add-act', async () => {
  const seneca = make()
  seneca.add('a:1', function a1(msg, reply) {
    reply({ x: msg.x + 1 })
  })
  seneca.message('b:1', async function b1(msg) {
    return { y: msg.y * 2 }
  })
  seneca.add('f:1', function f1(msg) {
    return { z: msg.z + 1 }
  })

  await seneca.ready()

  const out = await new Promise((resolve, reject) =>
    seneca.act('a:1,x:1', (err, out) => (err ? reject(err) : resolve(out))),
  )
  assert.deepEqual(out, { x: 2 })

  assert.deepEqual(await seneca.post('a:1', { x: 2 }), { x: 3 })
  assert.deepEqual(await seneca.post('b:1', { y: 3 }), { y: 6 })
  assert.deepEqual(seneca.direct('f:1,z:1'), { z: 2 })

  await seneca.close()
})

test('local-error', async () => {
  const seneca = make()
  seneca.add('c:1', function c1(msg, reply) {
    reply(new Error('c1-failed'))
  })
  seneca.add('c:2', function c2(msg, reply) {
    this.fail('c2-code', { x: msg.x })
  })
  await seneca.ready()

  await assert.rejects(seneca.post('c:1'), { message: /c1-failed/ })
  await assert.rejects(seneca.post('c:2,x:1'), { code: 'c2-code' })

  await seneca.close()
})

test('ready-callback', (t, done) => {
  const seneca = make()
  seneca.add('a:1', function a1(msg, reply) {
    reply({ x: 1 })
  })
  seneca.ready(function (err) {
    assert.ifError(err)
    assert.equal(this.has('a:1'), true)
    seneca.close(done)
  })
})

test('debounce', async () => {
  const seneca = make()
  let calls = 0
  seneca.add('d:1', function d1(msg, reply) {
    calls++
    setTimeout(() => reply({ x: msg.x }), 100)
  })
  await seneca.ready()

  // The first message is in flight when the second arrives, so the
  // second is dropped and resolves at once with an empty result.
  const first = seneca.post('d:1', { x: 1, debounce$: true })
  const second = await seneca.post('d:1', { x: 2, debounce$: true })
  assert.deepEqual(second, {})
  assert.deepEqual(await first, { x: 1 })
  assert.equal(calls, 1)

  // Nothing is in flight now, so the next message runs.
  assert.deepEqual(await seneca.post('d:1', { x: 3, debounce$: true }), {
    x: 3,
  })
  assert.equal(calls, 2)

  // Without debounce$, messages are never dropped.
  const all = await Promise.all([
    seneca.post('d:1', { x: 4 }),
    seneca.post('d:1', { x: 5 }),
  ])
  assert.deepEqual(all, [{ x: 4 }, { x: 5 }])
  assert.equal(calls, 4)

  await seneca.close()
})
