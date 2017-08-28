<template>
<div id="first">
  <h1>Red</h1>
  <input v-model="msg">
  <button v-on:click="act">Act</button>
  <button v-on:click="yo">Show</button>
  <!-- <button v-on:click="clear">Clear</button> -->
  <!-- <secondsection :res="res"></secondsection>
  <thirdsection :show="show" @passValue="show = $event"></thirdsection> -->
</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'a:1,x:3',
    }
  },
  methods: {

    act: function() {
      this.$options.parent.$options.parent.$options.seneca.act(this.msg, function(err, out) {
        this.act({
          cm: 'second',
          res: out
        })
      })
    },

    yo: function() {
      this.$options.parent.$options.parent.$options.seneca.act({
        ann: 'show',
        show: JSON.stringify(this.msg)
      })
    },
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
#first{
  background-color: #FF3333;
}
</style>
