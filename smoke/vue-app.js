
var seneca = Seneca()
    .test('print')
    .client({type:'browser', pin:'a:*'})
    .client({type:'browser', pin:'b:*'})


var first = new Vue({
  el: '#first',
  data: {
    msg: 'a:1,x:3',
  },
  methods: {

    act: function () {
      seneca.act(this.msg, function(err, out) {
        this.act({cm:'second', res:out})
      })
    },

    show: function () {
      seneca.act({ann:'show', show:JSON.stringify(this.msg)})
    }
  }
})


var second = new Vue({
  el: '#second',
  data: {
    res:''
  },
  beforeCreate: function () {
    var self = this
    
    seneca
      .add('cm:second', function(msg, reply) {
        self.res = msg.res.x
        reply()
      })
  }
})




var third = new Vue({
  el: '#third',
  data: {
    show:''
  },
  beforeCreate: function () {
    var self = this
    
    seneca
      .add('ann:show', function(msg, reply) {
        self.show = msg.show
        reply()
      })
  }
})



