
const Fs = require('fs')

const Seneca = require('seneca')
const Express = require('express')


const PORT = parseInt(process.argv[2],10) || 8181




async function run() {

  let seneca = Seneca({
    timeout: 500,
    legacy: false,
  })
      .test('print')
      .use('promisify')

      .use('gateway', {
        timeout: {
          client: true,
          max: 2000,
        }
      })
      .use('gateway-express', {error:{next:false}})

      .use('gateway$mapper')
      .use('gateway-express$mapper')

  //    .use('@seneca/external',{pins:['a:*', 'c:*', 'd:*']})


      .add('a:1', function(msg, reply) {
        var exp = this.explain()
        console.log('EXPLAIN', exp)
        
        exp && exp('an explanation')
        reply({ x: 1 + msg.x })
      })

      .add('b:1', function(msg, reply) {
        reply({ x: 2 + msg.x })
      })
  
      .add('c:1', function(msg, reply) {
        reply(new Error('foo'))
      })

      .add('d:1', function(msg, reply) {
        // timeout exceeds global timeout (set above)
        // so needs act timeout$
        setTimeout(function(){
          reply({ x: 3 + msg.x })
        },1000)
      })

      .add('e:1,p:foo', function(msg, reply) {
        reply(this.util.clean({...msg, x:11+msg.x}))
      })
      .add('e:2,p:bar', function(msg, reply) {
        reply(this.util.clean({...msg, x:22+msg.x}))
      })
      .add('e:3', function(msg, reply) {
        reply(this.util.clean({...msg, x:33+msg.x}))
      })

  
  await seneca.ready()


  console.log(await seneca.post({d:1,x:2,timeout$:2000}))
  
  let app = Express()

  app
    .use(Express.static(__dirname))
    .use(Express.json())
    .get('/seneca-browser.js', (req,res)=>{
      res.send(Fs.readFileSync(__dirname+'/../seneca-browser.js'))
    })
    .post('/seneca', seneca.export('gateway-express/handler'))
    .post('/api/seneca', seneca.export('gateway-express/handler'))

    .post('/api/mapper/:end', seneca.export('gateway-express$mapper/handler'))
  
    .listen(PORT)

  seneca.log.info('SITE','http://localhost:'+PORT)
}

run()


