/* Copyright (c) Richard Rodger 2019-2026, MIT license. */

// Load the BUILT bundle as a browser loads it with a <script> tag: as a
// classic script, in a context that has browser globals only (window,
// self, console, timers, fetch) and none of Node.js (process, require,
// module, Buffer, global). No real browser runs here.

const { test } = require('node:test')
const assert = require('node:assert')
const Fs = require('node:fs')
const Path = require('node:path')
const Vm = require('node:vm')

const Pkg = require('../package.json')

const source = Fs.readFileSync(
  Path.join(__dirname, '..', 'seneca-browser.js'),
  'utf8',
)

function browserContext() {
  const warns = []
  const quiet = () => {}
  const win = {
    console: {
      log: quiet,
      info: quiet,
      debug: quiet,
      error: quiet,
      warn: (...args) => warns.push(args.join(' ')),
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    queueMicrotask,
    fetch,
    URL,
    TextEncoder,
    TextDecoder,
    AbortController,
  }
  win.window = win
  win.self = win
  const context = Vm.createContext(win)
  Vm.runInContext(source, context, { filename: 'seneca-browser.js' })
  return { context, warns }
}

test('script-tag', async () => {
  const { context, warns } = browserContext()

  for (const name of ['process', 'require', 'module', 'Buffer', 'global']) {
    assert.equal(Vm.runInContext('typeof ' + name, context), 'undefined')
  }
  assert.equal(Vm.runInContext('typeof window.Seneca', context), 'function')
  assert.equal(Vm.runInContext('Seneca.browser.version', context), Pkg.version)

  // The code below runs inside the context, as page code would.
  const out = await Vm.runInContext(
    `(async function () {
      const seneca = Seneca({ log: 'silent' })
      seneca.add('a:1', function (msg, reply) {
        reply({ x: msg.x + 1 })
      })
      seneca.add('c:1', function (msg, reply) {
        reply(new Error('c1-failed'))
      })
      await seneca.ready()

      const out = {}
      out.a1 = await seneca.post('a:1,x:1')
      out.err = await seneca.post('c:1').then(
        () => null,
        (err) => err.message,
      )
      out.act_if = await new Promise((resolve, reject) =>
        seneca.act_if(true, 'a:1,x:2', (err, out) =>
          err ? reject(err) : resolve(out),
        ),
      )
      await seneca.close()
      return JSON.stringify(out)
    })()`,
    context,
  )

  const res = JSON.parse(out)
  assert.deepEqual(res.a1, { x: 2 })
  assert.match(res.err, /c1-failed/)
  assert.deepEqual(res.act_if, { x: 3 })

  assert.equal(warns.length, 1)
  assert.match(warns[0], /^\[SENECA_DEP_ACT_IF\] DeprecationWarning: /)
})
