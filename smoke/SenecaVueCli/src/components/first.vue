<template>
<div id="first">
  <b>Parent Component ~ First </b><br>
  <input v-model="msg">
  <button v-on:click="act">Act</button>
  <button v-on:click="yo">Show</button>
  <!-- <button v-on:click="clear">Clear</button> -->
  <!-- <secondsection :res="res"></secondsection>
  <thirdsection :show="show" @passValue="show = $event"></thirdsection> -->
</div>
</template>

<script>
// import Second from './second.vue';
// import Third from './third.vue';
// export default {
//   components: {
//     secondsection: Second,
//     thirdsection: Third
//   },

export default {
  data() {
    return {
      msg: 'a:1,x:3',
      res: '',
      show: ''
    }
  },
  methods: {

    act: function() {
      var self = this
      app.$options.seneca.act(this.msg, function(err, out) {
        this.act({
          cm: 'second',
          res: out
        })
        // var x = Object.values(out)
        // self.res = x[0]
      })
    },

    yo: function() {
      app.$options.seneca.act({
        ann: 'show',
        show: JSON.stringify(this.msg)
      })
    },

    // clear: function(){
    //   this.msg = '',
    //   this.res = '',
    //   this.show = ''
    // }
  },


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
  background-color: #6e42f4;
}
</style>
