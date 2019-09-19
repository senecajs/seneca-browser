var PORT = parseInt(process.argv[2],10) || 8080

var Seneca = require('seneca')
var Hapi = require('@hapi/hapi')
var Inert = require('@hapi/inert')

var seneca = Seneca({
  timeout: 500,
  legacy: { transport: false }
})
    .test('print')
    .use('seneca-promisify')
    .use('@seneca/hapi')
    .use('@seneca/external',{pins:['a:*', 'c:*', 'd:*']})

seneca.add('a:1', function(msg, reply) {
  var exp = this.explain()
  console.log('EXPLAIN', exp)

  exp && exp('an explanation')
  reply({ x: 1 + msg.x })
})

seneca.add('b:1', function(msg, reply) {
  reply({ x: 2 + msg.x })
})

seneca.add('c:1', function(msg, reply) {
  reply(new Error('foo'))
})

seneca.add('d:1', function(msg, reply) {
  // timeout exceeds global timeout (set above)
  // so needs act timeout$
  setTimeout(function(){
    reply({ x: 3 + msg.x })
  },1000)
})


seneca.ready(async function hapi() {
  var seneca = this
  var handler = seneca.export('hapi/action_handler')

  var server = new Hapi.Server({ port: PORT })

  await server.register(Inert)

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: __dirname
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
    method: 'POST',
    path: '/seneca',
    handler: handler
  })

  server.route({
    method: 'POST',
    path: '/api/seneca',
    handler: handler
  })

  await server.start()

  seneca.ready(function server_info() {
    console.log('\n\n+++++++++++++++++++++++\n')
    console.log(server.info)
    console.log('\n+++++++++++++++++++++++\n\n')
  })
})
