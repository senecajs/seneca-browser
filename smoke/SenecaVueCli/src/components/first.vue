<template>
  <div class="test">
    <input v-model="msg">
    <button v-on:click="act">act</button>
    <button v-on:click="yo">show</button>
    <secondsection :res="res"></secondsection>
    <thirdsection :show="show"></thirdsection>
  </div>

</template>

<script>
import Second from './second.vue';
import Third from './third.vue';
export default {
  components: {
    secondsection: Second,
    thirdsection: Third
  },
  data() {
    return{
      msg: 'a:1,x:3',
      res:'',
      show: ''
    }
  },
  methods: {

    act: function () {
      app.$options.seneca.act(this.msg, function(err, out) {
        this.act({cm:'second', res:JSON.stringify(out)})
        this.res = JSON.stringify(out.x);

      })
    },

    yo: function () {
      app.$options.seneca.act({ann:'show', show:JSON.stringify(this.msg)})
      this.show = JSON.stringify(this.msg);
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
