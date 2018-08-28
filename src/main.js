import Vue from 'vue'
import App from './App.vue'
import store from './store'

require('../static/css/main.css')

Vue.config.productionTip = false

let app = new Vue({
  name: 'root',
  store,
  data () {
    return {
      keys: {}
    }
  },
  methods: {
    handleKeyEvent(event) {
    this.keys[event.key] = event
    this.$store.dispatch('keyPress/editKeyPress', this.keys)
    }
  },
  render: h => h(App)
}).$mount('#app')

window.addEventListener('keydown', function(event){
  let eventObj = {
    active: true,
    key: event.key
  }
  app.handleKeyEvent(eventObj)
})

window.addEventListener('keyup', function(event){
  let eventObj = {
    active: false,
    key: event.key
  }
  app.handleKeyEvent(eventObj)
})
