import Vue from 'vue'
import Vuex from 'vuex'

import routing from './routing'
import keyPress from './keyPress'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    routing: {...routing, namespaced: true},
    keyPress: {...keyPress, namespaced: true}
  }
})
