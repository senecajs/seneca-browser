<template>
  <div id="third">
    <b>third</b><br>
    <p><i>{{show}}</i></p>
  </div>
</template>

<script>

export default {

  props:['show'],

  data() {
    return{
    }
  },

  methods: {
    callthisafter: function(){
      window.onload =  function () {
      var self = this
      app.$options.seneca
        .add('ann:show', function(msg, reply) {
          self.show = msg.show
          reply()
        })
    }
  }
},

  mounted () {
        this.callthisafter()
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
