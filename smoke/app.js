function show_res(code,pass) {
  document.getElementById('res_'+code).innerHTML = pass ? 'PASS' : 'FAIL'
}

var si0 = Seneca()
  .test('print')
  .client({ type: 'browser', pin: ['a:*', 'b:*', 'c:*', 'd:*'] })


  // ok
  .act('a:1,x:1', function(err, out) {
    // console.log('000', err, out)
    show_res('000',out.x===2)
  })


  // ok - extended timeout
  .act('d:1,x:2', {timeout$:1500}, function(err, out) {
    // console.log('001', err, out)
    show_res('001',out && out.x===5)
  })


/*
  // fail - no extended timeout
  .act('d:1,x:3', function(err, out) {
    console.log('002', err, err && err.code, out)
    show_res('002', err && err.code === 'action_timeout')
  })
*/

/*

// unsafe
  .act('b:1,x:2', function(err, out) {
    // console.log('003', err, err && err.code, err && err.message, out)
    show_res('003', err && err.code === 'external-not-allowed')
  })
*/

/*
  // error
  .act('c:1,x:3', function(err, out) {
    console.log('004', err, err && err.code, err && err.message, out)
    show_res('004', err && err.message === 'foo')
  })
*/


/*

var exp = []

var si1 = Seneca({ plugin: { browser: { endpoint: '/api/seneca' } } })
  .test('print')
  .client({ type: 'browser', pin: ['a:*', 'b:*', 'c:*'] })

  // ok, explain
    .act('a:1,x:1', {explain$:exp}, function(err, out) {
    console.log('EXPLAIN', exp)
    show_res('005', !err && 2 === out.x && exp[2].content === 'an explanation')
  })
*/


// Promises

si0.post('a:1,x:1').then((out)=>{
  show_res('006',out.x===2)
})


async function run_async() {
  var out = await si0.post('a:1,x:1')
  show_res('007',out.x===2)
}

run_async()



setTimeout(function() {
  var mapper = Seneca({
    tag:'mapper',
    plugin: {
      browser: {
        debug: true,
        endpoint: '/api/mapper',
        pathmap: {
          'p:foo': { suffix: '/foo?q=1' },
          'p:bar': { suffix: (msg)=>'/'+msg.p },
          'p:*': { suffix: '/zed' },
        }
      }
    }
  })
      .test('print')
      .client({
        type: 'browser',
        pin: ['e:*'],
      })

      .act('e:1,p:foo,x:1', function(err, out) {
        console.log('100', err, err && err.code, err && err.message, out)
        show_res('100', null == err && 'foo'===out.p && 12===out.x &&
                 'foo' === out.gateway.params.end &&
                 '1' === out.gateway.query.q)        
      })
      .act('e:2,p:bar,x:2', function(err, out) {
        console.log('101', err, err && err.code, err && err.message, out)
        show_res('101', null == err && 'bar'===out.p && 24===out.x &&
                 'bar' === out.gateway.params.end)        
      })
      .act('e:3,p:qaz,x:3', function(err, out) {
        console.log('102', err, err && err.code, err && err.message, out)
        show_res('102', null == err && 'qaz'===out.p && 36===out.x &&
                 'zed' === out.gateway.params.end)        
      })

  
},222)
