export default {
  editModule ({state, commit}, moduleObj) {
    commit('EDIT_MODULE', moduleObj)
  },
  addModule ({state, commit}, moduleObj) {
    commit('ADD_MODULE', moduleObj)
  }
}
