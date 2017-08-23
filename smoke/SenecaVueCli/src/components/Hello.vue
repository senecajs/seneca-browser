<template>
  <div class="hello">
    <b>first</b><br>
    <input v-model="msg">
    <button v-on:click="act">act</button>
    <button v-on:click="show">show</button>
  </div>
</template>

<script>
import seneca from './seneca/seneca.js'
import senecatest from './seneca/senecatest.js'

export default {

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
