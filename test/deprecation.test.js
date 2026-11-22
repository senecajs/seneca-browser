/* Copyright (c) Richard Rodger 2019-2026, MIT license. */

// Regression test: Seneca reports deprecations with process.emitWarning,
// which the browserify process shim inside the BUILT bundle lacks. Without
// the shim of seneca-browser-src.js, a deprecated call throws a TypeError.
// Seneca reports each deprecation once per process, so this file runs in
// its own process (node --test runs each file in a separate process).

const { test } = require('node:test')
const assert = require('node:assert')

const Seneca = require('../seneca-browser.js')

function captureWarn() {
  const warns = []
  const orig = console.warn
  console.warn = (...args) => warns.push(args.join(' '))
  return {
    warns,
    restore: () => {
      console.warn = orig
    },
  }
}

test('no-deprecation-from-the-bundle-itself', async () => {
  const cap = captureWarn()
  try {
    const seneca = Seneca({ log: 'silent' })
    await seneca.ready()
    await seneca.close()
  } finally {
    cap.restore()
  }
  assert.deepEqual(
    cap.warns.filter((w) => w.includes('SENECA_DEP_')),
    [],
  )
})

test('deprecation-is-not-fatal', async () => {
  const seneca = Seneca({ log: 'silent' })
  seneca.add('a:1', function a1(msg, reply) {
    reply({ x: msg.x + 1 })
  })
  await seneca.ready()

  const cap = captureWarn()
  let out, plugins
  try {
    out = await new Promise((resolve, reject) => {
      // act_if is deprecated (SENECA_DEP_ACT_IF).
      seneca.act_if(true, 'a:1,x:1', (err, out) =>
        err ? reject(err) : resolve(out),
      )
    })
    // plugins() is deprecated (SENECA_DEP_PLUGINS).
    plugins = seneca.plugins()
  } finally {
    cap.restore()
  }

  assert.deepEqual(out, { x: 2 })
  assert.ok(plugins.browser)

  assert.equal(cap.warns.length, 2)
  assert.match(cap.warns[0], /^\[SENECA_DEP_ACT_IF\] DeprecationWarning: /)
  assert.match(cap.warns[1], /^\[SENECA_DEP_PLUGINS\] DeprecationWarning: /)

  // Reported once per process.
  const again = captureWarn()
  try {
    seneca.plugins()
  } finally {
    again.restore()
  }
  assert.deepEqual(again.warns, [])

  await seneca.close()
})
