/* Copyright (c) Richard Rodger 2019-2020, MIT license. */

require('util.promisify/shim')()
var Timers = require('timers')
var SenecaModule = require('seneca')
var SenecaPromisify = require('seneca-promisify')

console.log('SP', SenecaPromisify)

global.setImmediate = global.setImmediate || Timers.setImmediate

var SenecaExport = function (options, more_options) {
  options = options || {}
  options.legacy = options.legacy || false

  var seneca = SenecaModule(options, more_options)

  seneca.use(SenecaPromisify)

  seneca.use({
    name: 'browser',
    init: function browser(options) {
      options.endpoint = options.endpoint || '/seneca'
      this.add('role:transport,hook:client,type:browser', hook_client_browser)

      var tu = this.export('transport/utils')

      function hook_client_browser(msg, reply) {
        var seneca = this

        reply({
          send: function (msg, reply, meta) {
            fetch(options.endpoint, {
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'same-origin',
              method: 'post',
              body: tu.stringifyJSON(tu.externalize_msg(seneca, msg, meta)),
            })
              .then(function (response) {
                if (response.ok) {
                  return response.json()
                } else {
                  // FIX: handle transport errors
                  return null
                }
              })
              .then(function (json) {
                // FIX: seneca.reply broken in browser
                var rep = tu.internalize_reply(seneca, json)
                reply(rep.err, rep.out, rep.meta)
              })
          },
        })
      }
    },
  })

  return seneca
}

SenecaExport.prototype = SenecaModule.prototype

module.exports = SenecaExport
