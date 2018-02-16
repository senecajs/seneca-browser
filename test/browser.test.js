'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = (exports.lab = Lab.script())
const expect = Code.expect

const SenecaBrowser = require('../seneca-browser.js')

global.fetch = function(url, spec) {
  return new Promise(function(resolve, reject) {
    setTimeout(
      resolve({
        ok: true,
        json: function() {
          var obj = JSON.parse(spec.body)
          return { y: 3, meta$: { id: obj.meta$.id } }
        }
      }),
      10
    )
  })
}

lab.test('happy', fin => {
  SenecaBrowser()
    .test(fin)
    .client({ type: 'browser', pin: 'a:*' })
    .act('a:1,x:2', function(ignore, out) {
      expect(out.y).equal(3)
      fin()
    })
})
