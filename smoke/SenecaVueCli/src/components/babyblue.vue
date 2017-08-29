<template>
    <div id="second">
      <h2>BabyBlue</h2>
      <h5>Prop Value</h5>
      <p>{{res}}</p>
      <h5>Total</h5>
      <p>{{total}}</p>
    </div>
</template>

<script>

export default {

  props:['res'],

  data() {
    return {
      total: 0,
    }
  },
  watch: {
      // whenever res changes, this function will run
      res: function (newVal) {
        this.total += Number(newVal)
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
#second {
  background-color: #05ADCB;
}
</style>
