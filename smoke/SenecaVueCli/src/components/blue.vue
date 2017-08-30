<template>
    <div id="second">
      <h2>Blue</h2>
      <p>{{res}}</p>
      <babybluesection :res="res"></babybluesection>
    </div>
</template>

<script>
import BabyBlue from './babyblue.vue';

export default {
  components: {
    babybluesection: BabyBlue,
  },

  data() {
    return {
      res: ''
    }
  },

  mounted () {
    var blue = this;
    var seneca = this.$options.parent.$options.parent.$options.seneca;
    seneca.add('cm:blue', function(msg, reply) {
            blue.res = msg.res.x
            reply()
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
#second {
  background-color: #0529CB;
}
</style>
