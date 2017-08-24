<template>
  <div class="hello">
    <b>first</b><br>
    <input v-model="msg">
    <button v-on:click="act">act</button>
    <button v-on:click="yo">show</button>
    <div id="second">
      <b>second</b><br>
      <p>{{res}}</p>
    </div>

    <div id="third">
      <b>third</b><br>
      <p><i>{{show}}</i></p>
    </div>
  </div>
</template>

<script>
// import seneca2 from './seneca/seneca.js'
// import senecatest from './seneca/senecatest.js'
//
// var seneca;
// seneca = Seneca()
//     .test('print')
//     .client({type:'browser', pin:'a:*'})
//     .client({type:'browser', pin:'b:*'})

export default {


  data() {
    return{
      msg: 'a:1,x:3',
      res:'',
      show: ''
    }
  },
  methods: {

    act: function () {
      console.log('high ')
      seneca.act(this.msg, function(err, out) {
        this.act({cm:'second', res:out})
      })
    },

    yo: function () {
      seneca.act({ann:'show', show:JSON.stringify(this.msg)})
    }
  },
  beforeCreate: function () {
    var self = this

    seneca
      .add('cm:second', function(msg, reply) {
        self.res = msg.res.x
        reply()
      })
  },

  created: function () {
    var self = this

    seneca
      .add('ann:show', function(msg, reply) {
        self.show = msg.show
        reply()
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
