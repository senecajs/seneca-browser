<template>

  <div class="container">
                <div class="row">
                    <div class="header">
                      <firstsection></firstsection>
                    </div>
                </div>
              </div>

</template>

<script>
import First from './components/first.vue';


export default {
  components: {
    firstsection: First,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
