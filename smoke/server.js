var Seneca = require('seneca')
var Hapi = require('hapi')
var Inert = require('inert')


var seneca = Seneca({legacy:{transport:false}})
    .test('print')

    .use('handler')
    .listen({type:'browser', pin:['a:*','c:*']})


seneca.add('a:1', function (msg, reply) {
  reply({x: 1 + msg.x})
})

seneca.add('b:1', function (msg, reply) {
  reply({x: 2 + msg.x})
})

seneca.add('c:1', function (msg, reply) {
  reply(new Error('foo'))
})

seneca.ready(function () {
  var handler = seneca.export('handler')

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
    method: 'GET',
    path: '/seneca-browser.js',
    handler: {
      file: __dirname + '/../seneca-browser.js'
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
