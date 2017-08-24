<template>

  <div class="container">
                <div class="row">
                    <div class="header">
                      <firstsection></firstsection>
                    </div>
                    <div class="content">
                      <secondsection></secondsection>
                  </div>
                  <div class="content">
                    <thirdsection></thirdsection>
                </div>
                </div>
              </div>

</template>

<script>

import Hello from './components/Hello.vue';
import First from './components/first.vue';
import Second from './components/second.vue';
import Third from './components/third.vue';

export default {
  components: {
    hellosection: Hello,
    firstsection: First,
    secondsection: Second,
    thirdsection: Third
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
