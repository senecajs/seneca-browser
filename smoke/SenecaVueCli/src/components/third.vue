<template>
  <div id="third">
    <b>third</b><br>
    <p><i>{{show}}</i></p>
  </div>
</template>

<script>

export default {

  data() {
    return{
      show: ''
    }
  },

  mounted () {
    window.onload =  function () {
        var self = this
        console.log('third')
        console.log(app.$options.seneca)
        console.log('third')
        app.$options.seneca
          .add('ann:show', function(msg, reply) {
            self.show = msg.show
            reply()
          })
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
