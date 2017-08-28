<template>
<div id="third">
  <h2>Green</h2>
  <p><i>{{show}}</i></p>
</div>
</template>

<script>
export default {


  data() {
    return {
      show: ''
    }
  },

  mounted(){
  var green = this;
    this.$options.parent.$options.parent.$options.seneca.add('ann:show', function(msg, reply) {
          green.show = msg.show
          //yo.$emit('passValue',self.show)
          reply()
        })

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
  background-color: #08CB05;
}
</style>
