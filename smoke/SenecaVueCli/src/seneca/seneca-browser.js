var Timers = require('timers')
var SenecaModule = require('seneca')

global.setImmediate = Timers.setImmediate

var SenecaExport = function(options, more_options) {
  options = options || {}
  options.legacy = options.legacy || {}
  options.legacy.transport = false

  var seneca = SenecaModule(options, more_options)

  seneca.use(function browser() {
    this.add('role:transport,hook:client,type:browser', hook_client_browser)

    var tu = this.export('transport/utils')

    function hook_client_browser(msg, reply) {
      var seneca = this
      
      reply({
        send: function(msg, reply, meta) {
          fetch('/seneca', {
	    method: 'post',
	    body: tu.stringifyJSON(tu.externalize_msg(seneca, msg))

          }).then(function(response) { 
            if(response.ok) {
	      return response.json()
            }
            else {
              // FIX: handle transport errors
              return null
            }
          }).then(function(json) {
            // FIX: seneca.reply broken in browser
            var rep = tu.internalize_reply(seneca, json)
            reply(rep.err, rep.out)
          })
        }
      })
    }
  })
  
  return seneca
}

SenecaExport.prototype = SenecaModule.prototype

module.exports = SenecaExport



