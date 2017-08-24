// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App'
import { routes } from './router/routes';
import seneca2 from './seneca/seneca.js'
import senecatest from './seneca/senecatest.js'

Vue.config.productionTip = false

var seneca;
seneca = Seneca()
    //.test('print')
    .client({type:'browser', pin:'a:*'})
    .client({type:'browser', pin:'b:*'})

console.log(seneca)

const router =  new VueRouter({
  routes,
  mode: 'history'
});

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  routes,
  seneca,
  render: h => h(App)
});

Vue.use(VueRouter);
Vue.use(seneca);

console.log(app.$options.seneca)

global.app = app; //Define you app variable globally
