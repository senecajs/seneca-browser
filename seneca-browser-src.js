/* Copyright (c) Richard Rodger 2019-2024, MIT license. */

require('util.promisify/shim')()
let Timers = require('timers')
let SenecaModule = require('seneca4')
// let SenecaPromisify = require('seneca-promisify')

global.setImmediate = global.setImmediate || Timers.setImmediate

let SenecaExport = function (options, more_options) {
  options = options || {}
  options.legacy = options.legacy || false

  let seneca = SenecaModule(options, more_options)

  // seneca.use(SenecaPromisify)

  seneca.use({
    name: 'browser',
    init: function browser(options) {
      // endpoint:
      // - string: endpoint string
      // - function(msg, config, meta): returns endpoint string, can modify config

      options.endpoint = options.endpoint || '/seneca'

      options.fetch = options.fetch || {}
      options.headers = options.headers || {}

      this.add('role:transport,hook:client,type:browser', hook_client_browser)

      let tu = this.export('transport/utils')

      let pathMapper
      // { 'a:1,b:2': { endpoint, suffix, prefix } }
      if ('object' === typeof options.pathmap) {
        pathMapper = seneca.util.Patrun({ gex: true })
        Object.entries(options.pathmap).forEach((entry) => {
          pathMapper.add(seneca.util.Jsonic(entry[0]), entry[1])
        })

        if (options.debug) {
          console.log('SENECA', 'pathmap', '' + pathMapper)
        }
      }

      function hook_client_browser(msg, reply) {
        let seneca = this

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

            let endpoint = options.endpoint

            if ('function' === typeof endpoint) {
              endpoint = endpoint.call(seneca, msg, config, meta)
            } else if (pathMapper) {
              let spec = pathMapper.find(msg)
              if (spec) {
                endpoint =
                  null != spec.endpoint
                    ? spec.endpoint
                    : (null == spec.prefix
                        ? ''
                        : 'function' === typeof spec.prefix
                          ? spec.prefix.call(seneca, msg, config, meta)
                          : spec.prefix) +
                      endpoint +
                      (null == spec.suffix
                        ? ''
                        : 'function' === typeof spec.suffix
                          ? spec.suffix.call(seneca, msg, config, meta)
                          : spec.suffix)
              }
            }

            fetch(endpoint, config)
              .then(function (response) {
                try {
                  let json = response.json()
                  return json
                } catch (e) {
                  e.message =
                    response.status +
                    ': ' +
                    response.statusText +
                    ': ' +
                    e.message
                  return reply(e)
                }
              })
              .then(function (json) {
                // FIX: seneca.reply broken in browser

                // TODO: transport should handle this
                if (Array.isArray(json)) {
                  json.meta$ = { id: 'ID' }
                }
                let rep = tu.internalize_reply(seneca, json)

                reply(rep.err, rep.out, rep.meta)
              })
          },
        })
      }
    },
  })

  async function resolveHeaders(headers) {
    let names = Object.keys(headers)
    for (let h of names) {
      let v = headers[h]
      if ('function' === typeof v) {
        headers[h] = await v()
      } else {
        headers[h] = v
      }
    }
    return headers
  }

  seneca.root.order.inward.add({
    name: 'debounce',
    before: 'inward_msg_modify',
    exec: function (spec) {
      let msg = spec.data.msg

      if (msg.debounce$) {
        let log = spec.ctx.seneca.status().history.log

        // TODO: just using pattern is not sufficient - conflates
        // unrelated messages - need to check params too...
        let actdef = spec.ctx.seneca.find(msg)
        if (!actdef) return null

        for (let i = log.length - 1; -1 < i; i--) {
          if (
            log[i].meta.pattern === actdef.pattern &&
            // Only drop if there's a previous inflight
            0 === log[i].result.length
          ) {
            return {
              // TODO: need a `drop` operation
              op: 'stop',
              out: {
                kind: 'result',
                result: {},
              },
            }
          }
        }
      }

      return null
    },
  })

  return seneca
}

SenecaExport.util = SenecaModule.util
SenecaExport.valid = SenecaModule.valid
SenecaExport.prototype = SenecaModule.prototype
SenecaExport.browser = {
  version: '7.1.0',
}

module.exports = SenecaExport
