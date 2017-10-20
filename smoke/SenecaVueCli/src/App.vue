<template>
<div class="container">
  <div class="row">
    <div class="header">
      <redsection></redsection>
      <bluesection></bluesection>
      <greensection></greensection>
    </div>
  </div>
</div>
</template>

<script>
import Red from './components/red.vue';
import Blue from './components/blue.vue';
import Green from './components/green.vue';

export default {
  components: {
    redsection: Red,
    bluesection: Blue,
    greensection: Green
  }
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
