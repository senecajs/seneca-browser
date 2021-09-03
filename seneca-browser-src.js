/* Copyright (c) Richard Rodger 2019-2020, MIT license. */

require('util.promisify/shim')()
var Timers = require('timers')
var SenecaModule = require('seneca')
var SenecaPromisify = require('seneca-promisify')

console.log('SenecaBrowser 04')

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
      options.fetch = options.fetch || {}
      options.headers = options.headers || {}

      this.add('role:transport,hook:client,type:browser', hook_client_browser)

      var tu = this.export('transport/utils')

      function hook_client_browser(msg, reply) {
        var seneca = this

        reply({
          send: async function (msg, reply, meta) {
            let config = {
              // credentials: 'same-origin',
              method: 'post',
              ...options.fetch,
              mode: 'cors',
              cache: 'no-cache',
              headers: await resolveHeaders({
                'Content-Type': 'application/json',
                ...options.fetch.headers,
                ...options.headers,
              }),
              body: tu.stringifyJSON(tu.externalize_msg(seneca, msg, meta)),
            }
            // console.log('FETCH', options.endpoint, JSON.stringify(config))
            fetch(options.endpoint, config)
              .then(function (response) {
                if (response.ok) {
                  return response.json()
                } else {
                  // FIX: handle transport errors
                  // return null
                  return reply(new Error(JSON.stringify(response)))
                }
              })
              .then(function (json) {
                // FIX: seneca.reply broken in browser

                // TODO: transport should handle this
                if(Array.isArray(json)) {
                  json.meta$ = {id:'ID'}
                }
                console.log('REPLY JSON', json)
                var rep = tu.internalize_reply(seneca, json)
                console.log('REPLY INT', rep)
                reply(rep.err, rep.out, rep.meta)
              })
          },
        })
      }
    },
  })

  
  async function resolveHeaders(headers) {
    let names = Object.keys(headers)
    for(let h of names) {
      let v = headers[h]
      if('function'===typeof(v)) {
        headers[h] = await v()
      }
      else {
        headers[h] = v
      }
    }
    console.log('RH', headers)
    return headers
  }

  
  return seneca
}

SenecaExport.prototype = SenecaModule.prototype

module.exports = SenecaExport
