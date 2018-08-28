export default {
  editKeyPress ({state, commit}, eventObj) {
    commit('KEY_EVENT', eventObj)
  }
}
