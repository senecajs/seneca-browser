<template>
  <div class="test">
    <input v-model="msg">
    <button v-on:click="act">act</button>
    <button v-on:click="yo">show</button>
  </div>
</template>

<script>
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
      app.$options.seneca.act(this.msg, function(err, out) {
        this.act({cm:'second', res:out})
      })
    },

    yo: function () {
      app.$options.seneca.act({ann:'show', show:JSON.stringify(this.msg)})
    }
  },


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
