var Seneca = require('seneca')
var Hapi = require('hapi')
var Inert = require('inert')


var seneca = Seneca({legacy:{transport:false}}).test('print')
var tu = seneca.export('transport/utils')
    
seneca.add('a:1', function (msg, reply) {
  reply({x: 1 + msg.x})
})

function listen(data, respond) {
  var json = 'string' === typeof data ? tu.parseJSON(data) : data
  var msg = tu.internalize_msg(seneca, json)
  seneca.act(msg, function (err, out, meta) {
    respond(tu.externalize_reply(this, err, out, meta))
  })
}


var server = new Hapi.Server()
server.connection({port: 8080})

server.register( Inert )

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: __dirname,
    }
  }
})

server.route({ 
  method: 'POST', path: '/seneca', 
  handler: function( request, reply ) {
    listen(request.payload, reply)
  }
})



server.start(console.log)      

