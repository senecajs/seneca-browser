var s = Seneca({legacy:{transport:false}}).test('print')

s.use(function browser() {
  this.add('role:transport,hook:listen,type:browser', hook_listen_browser)
  this.add('role:transport,hook:client,type:browser', hook_client_browser)

  var tu = this.export('transport/utils')
  console.log(tu)

  function hook_listen_browser(msg, reply) {reply()}

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

s.client({type:'browser', pin:'a:*'})

s.act('a:1,x:1', console.log)
