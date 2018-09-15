import Vue from 'vue'
import App from './App.vue'
import store from './store'

require('../static/css/main.css')

Vue.config.productionTip = false

new Vue({
  name: 'root',
  store,
  render: h => h(App)
}).$mount('#app')
