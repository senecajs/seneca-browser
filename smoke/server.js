var Seneca = require('seneca')
var Hapi = require('hapi')
var Inert = require('inert')


var seneca = Seneca({legacy:{transport:false}})
    .test('print')
    .use('../')
    .listen({type:'browser', pin:'a:*'})

var tu = seneca.export('transport/utils')
    
seneca.add('a:1', function (msg, reply) {
  reply({x: 1 + msg.x})
})

seneca.ready(function () {
  var handler = seneca.export('browser/handler')

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
      handler(request.payload, reply)
    }
  })



  server.start(console.log)      
})
