<template>
<div id="third">
  <b>Child Component 2 ~ Third</b><br>
  <p><i>{{show}}</i></p>
</div>
</template>

<script>
export default {

  // props: ['show'],

  data() {
    return {
      show: ''
    }
  },


  methods: {
    callthisafter: function() {
      var yo = this;
      window.onload = function() {
        var self = this
        app.$options.seneca.add('ann:show', function(msg, reply) {
            yo.show = msg.show
            //yo.$emit('passValue',self.show)
            reply()
          })
      }
    }
  },

  mounted() {
    this.callthisafter()
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
#third{
  background-color: #4286f4;
}
</style>
