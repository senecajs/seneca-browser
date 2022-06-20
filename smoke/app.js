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

