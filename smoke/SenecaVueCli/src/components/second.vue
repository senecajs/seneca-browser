<template>
    <div id="second">
      <b>second</b><br>
      <p>{{res}}</p>
    </div>
</template>

<script>

export default {

  data() {
    return{
      res:'',
    }
  },

  mounted () {
    window.addEventListener("load", function(evt) {
      var self = this
      console.log('second')
      console.log(app.$options.seneca)
      console.log('second')
      app.$options.seneca
        .add('cm:second', function(msg, reply) {
          self.res = msg.res.x
          console.log(self.res)
          reply()
        })
    })
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
