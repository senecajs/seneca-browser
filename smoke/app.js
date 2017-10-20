Seneca()
  .test('print')
  .client({type:'browser', pin:['a:*','b:*','c:*']})

  // ok
  .act('a:1,x:1', console.log)

  // unsafe
  .act('b:1,x:2', console.log)

  // error
  .act('c:1,x:3', console.log)
