export default {
  KEY_EVENT (state, eventObj) {
    for (let key in eventObj){
      if (!eventObj[key].active) {
        delete state.keys[key]
      } else {
        state.keys[key] = eventObj[key]
      }
    }
  }
}
