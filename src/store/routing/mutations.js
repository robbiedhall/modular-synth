export default {
  ADD_MODULE (state, moduleObj) {
    state.modules[moduleObj.name] = {...moduleObj}
  },
  EDIT_MODULE (state, moduleObj) {
    // Check for neighbouring connections
    let conns = moduleObj.connections
    for (let conn in conns) {
      let neighbour = state.modules[conns[conn].target.moduleName]
       if (neighbour.connections[conns[conn].target.direction].in && conns[conn].out){
         neighbour.connections[conns[conn].target.direction].latched = true
         conns[conn].latched = true
       } else if (neighbour.connections[conns[conn].target.direction].out && conns[conn].in){
         neighbour.connections[conns[conn].target.direction].latched = true
         conns[conn].latched = true
       } else {
         neighbour.connections[conns[conn].target.direction].latched = false
         conns[conn].latched = false
       }
    }
    state.modules[moduleObj.name] = moduleObj
  }
}
