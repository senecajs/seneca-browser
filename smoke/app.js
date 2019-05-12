Seneca()
  .test('print')
  .client({ type: 'browser', pin: ['a:*', 'b:*', 'c:*'] })

  // ok
  .act('a:1,x:1', console.log)

  // unsafe
  .act('b:1,x:2', console.log)

  // error
  .act('c:1,x:3', console.log)

var exp = []

var si = Seneca({ plugin: { browser: { endpoint: '/api/seneca' } } })
  .test('print')
  .client({ type: 'browser', pin: ['a:*', 'b:*', 'c:*'] })

  // ok
  .act('a:1,x:1', console.log)

  // unsafe
  .act('b:1,x:2', console.log)

  // error
  .act('c:1,x:3', console.log)

  // ok, explain
  .act('a:1,x:1', {explain$:exp}, function() {
    console.log(arguments)
    console.log('EXPLAIN', exp)
  })


