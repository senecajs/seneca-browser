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
#second {
  background-color: #f4428c;
}
</style>
<template>
    <div id="second">
      <b>Child Component 1 ~ Second</b><br>
      <p>{{res}}</p>
    </div>
</template>

<script>

export default {

  props:['res'],

  data() {
    return{
    }
  },

  methods:{
    callthisafterplease: function(){
      window.addEventListener("load", function(evt) {
        var self = this
        app.$options.seneca
          .add('cm:second', function(msg, reply) {
            this.res = msg.res.x
            reply()
          })
      })

    }
  },

  beforeMount () {
      this.callthisafterplease()
  },

}
</script>
