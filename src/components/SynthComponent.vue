<template>
  <div class="synth-component">
    <button class="fa fa-power-off power-button" @click="toggleModulePower" :class="[this.module.power ? 'power-on' : 'power-off']"/>

    <div class="connect-button" v-for="(dir, key, i) in module.connections" :key="i" v-if="dir" :class="key" @click="toggleConnect(key)">
      <button :class="[!module.connections[key].active ? 'connect-off' : module.connections[key].in ? 'connect-in' : 'connect-out']">
        <div class="icon-group" v-if="key === 'left'">
          <i class=" fa fa-chevron-left" v-if="module.connections[key].active && !module.connections[key].in"></i>
          <i class=" fa fa-chevron-right" v-if="module.connections[key].active && module.connections[key].in"></i>
          <i class=" fa fa-times" v-if="!module.connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'right'">
          <i class=" fa fa-chevron-right" v-if="module.connections[key].active && !module.connections[key].in"></i>
          <i class=" fa fa-chevron-left" v-if="module.connections[key].active && module.connections[key].in"></i>
          <i class=" fa fa-times" v-if="!module.connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'up'">
          <i class=" fa fa-chevron-up" v-if="module.connections[key].active && !module.connections[key].in"></i>
          <i class=" fa fa-chevron-down" v-if="module.connections[key].active && module.connections[key].in"></i>
          <i class=" fa fa-times" v-if="!module.connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'down'">
          <i class=" fa fa-chevron-up" v-if="module.connections[key].active && module.connections[key].in"></i>
          <i class=" fa fa-chevron-down" v-if="module.connections[key].active && !module.connections[key].in"></i>
          <i class=" fa fa-times" v-if="!module.connections[key].active"></i>
        </div>
      </button>
    </div>
    <BlankModule :module="module" class="module" v-if="!module.power"/>
    <ActiveModule @change-module-type="changeModuleType" :module="module" class="module" v-if="module.power"/>
  </div>


</template>

<script>

import BlankModule from './BlankModule.vue'
import ActiveModule from './ActiveModule.vue'

export default {
  name: 'SynthComponent',
  components: {
    BlankModule,
    ActiveModule
  },
  props: {
    position: {
      type: String
    },
    name: {
      type: String
    },
    keys: {
      type: Object
    }
  },
  data () {
    return {
      module: { },
      neighbours: { },
      moduleTypes: [
        'key-input',
        'audio-out'
      ]
    }
  },
  computed: {
    connections() {
      return this.module.connections
    },
    // outgoingConnections () {
    //   let conns = this.connections
    //   let connObj = { }
    //   for (let conn in conns) {
    //     if(conns[conn].out) {
    //       connObj[conn] = {...conns[conn]}
    //     }
    //   }
    //   return connObj
    // },
    incomingConnections () {
      let neighs = this.neighbours
      let conns = this.connections
      let connObj = { }
      for (let conn in conns) {
        console.log(conn)
        let target = this.$store.getters['routing/modules'][neighs[conn]].connections
        connObj[conn] = target
      }
      return connObj
    },
    // activeIncomingConnections () {
    //   let connObj = { }
    //   let inConns = this.incomingConnections
    //   let conns = this.connections
    //   for (let conn in inConns) {
    //     if (this.connections[conn].in){
    //       let name = this.neighbours[conn]
    //       connObj[name] = this.$store.getters['routing/modules'][name]
    //     }
    //   }
    //   return connObj
    // },
    // activeOutgoingConnections () {
    //   let connObj = { }
    //   let outConns = this.outgoingConnections
    //   let conns = this.connections
    //   for (let conn in outConns) {
    //     if (this.connections[conn].out){
    //       let name = this.neighbours[conn]
    //       connObj[name] = this.$store.getters['routing/modules'][name]
    //     }
    //   }
    //   return connObj
    // }
  },
  created () {
    let neighboursObj = { }
    if (this.position[0] !== '1'){
      let upNeighbourPos = parseInt(this.position) - 10
      let upNeighbourName = `module${upNeighbourPos}`
      neighboursObj.up = upNeighbourName
    }
    if (this.position[0] !== '5'){
      let downNeighbourPos = parseInt(this.position) + 10
      let downNeighbourName = `module${downNeighbourPos}`
      neighboursObj.down = downNeighbourName
    }
    if (this.position[1] !== '1'){
      let leftNeighbourPos = parseInt(this.position) - 1
      let leftNeighbourName = `module${leftNeighbourPos}`
      neighboursObj.left = leftNeighbourName
    }
    if (this.position[1] !== '5'){
      let rightNeighbourPos = parseInt(this.position) + 1
      let rightNeighbourName = `module${rightNeighbourPos}`
      neighboursObj.right = rightNeighbourName
    }

    this.neighbours = neighboursObj

    let moduleObj = {
      name: this.name,
      power: false,
      connections: this.buildConnectionObject(this.position),
      type: '',
      pos: this.position
    }
    this.$store.dispatch('routing/addModule', moduleObj)
    this.module = moduleObj
  },

  watch: {
    module: {
      handler (newVal) {
        let moduleObj = {...newVal}
        this.$emit('module-change-event')
        this.$store.dispatch('routing/editModule', moduleObj)
      },
      deep: true
    }
  },
  methods: {
    changeModuleType (dir, moduleName) {
      let currentIndex = this.moduleTypes.findIndex(e => e === this.module.type)
      if (currentIndex === this.moduleTypes.length-1) {
        this.module.type = this.moduleTypes[0]
      } else {
        this.module.type = this.moduleTypes[currentIndex + 1]
      }
    },

    toggleConnect (dir) {
      let conn = this.module.connections[dir]
      if (!conn.active) {
        conn.active = true
        conn.out = false
        conn.in = true
      } else if (conn.in) {
        conn.in = false
        conn.out = true
      } else {
        conn.out = false
        conn.active = false
      }
    },
    toggleModulePower () {
      if (!this.module.type) {
        this.module.type = 'key-input'
      }
      this.module.power = !this.module.power
    },
    buildConnectionObject (pos) {
      let connObj = { }
      if(pos[1] !== '1'){
        connObj.left = {
          active: true,
          in: true,
          out: false,
          inType: '',
          outType: '',
          latched: false,
          target: {
            moduleName: this.neighbours.left,
            direction: 'right'
          }
        }

      }
      if(pos[1] !== '3'){
        connObj.right = {
          name: 'right',
          active: true,
          in: true,
          out: false,
          inType: '',
          outType: '',
          latched: false,
          target: {
            moduleName: this.neighbours.right,
            direction: 'left'
          }
        }
      }
      if(pos[0] !== '1'){
        connObj.up = {
          name: 'up',
          active: true,
          in: true,
          out: false,
          inType: '',
          outType: '',
          latched: false,
          target: {
            moduleName: this.neighbours.up,
            direction: 'down'
          }
        }
      }
      if(pos[0] !== '3'){
        connObj.down = {
          name: 'down',
          active: true,
          in: true,
          out: false,
          inType: '',
          outType: '',
          latched: false,
          target: {
            moduleName: this.neighbours.down,
            direction: 'up'
          }
        }
      }
      return connObj
    }
  }
}

// const buildConnectionObject = function(pos) {
//   let connObj = { }
//   if(pos[1] !== '1'){
//     connObj.left = {
//       active: true,
//       in: true,
//       out: false,
//       inType: '',
//       outType: '',
//       latched: false,
//       //target: this.neighbours['right']
//     }
//   }
//   if(pos[1] !== '5'){
//     connObj.right = {
//       active: true,
//       in: true,
//       out: false,
//       inType: '',
//       outType: '',
//       latched: false,
//       //target: this.neighbours['left']
//     }
//   }
//   if(pos[0] !== '1'){
//     connObj.up = {
//       active: true,
//       in: true,
//       out: false,
//       inType: '',
//       outType: '',
//       latched: false,
//       //target: this.neighbours['down']
//     }
//     //console.log(this.neighbours)
//
//   }
//   if(pos[0] !== '5'){
//     connObj.down = {
//       active: true,
//       in: true,
//       out: false,
//       inType: '',
//       outType: '',
//       latched: false,
//       //target: this.neighbours['up']
//     }
//   }
//   return connObj
// }
</script>

<style>
  .synth-component {
    display: inline-grid;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: repeat(11, 1fr);
    width: 100%;
    height: 100%;
    background: grey;
    border: 1px solid white;
  }
  .power-button {
    z-index: 1000;
    grid-row: 1/3;
    grid-column: 10/12;
    border: 0;
  }
  .module {
    grid-row: 1 / 12;
    grid-column: 1/ 12;
    height: 100%;
    width: 100%;
  }

  .power-on {
    color: white;
    background: green;
  }

  .power-off {
    color: black;
    background: red;
  }
  .connect-button {
    z-index: 10;
  }

  .connect-button button {
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .connect-button button:hover {
    box-shadow: inset 0 0 0 rgba(255,522,522,1);
  }

  .connect-button button i {
    padding: 3px;
    border-radius: 5px;
    background: rgba(255,255,255,0.6);
  }
  .connect-in {
    background: lightblue;
  }

  .connect-out {
    background: lightgreen;
  }

  .connect-off {
    background: rgb(255,150,150);
  }

  .connect-conflict {
    border: 1px solid red;
  }
  .connect-ok{
    border: 1px solid green;
  }

  .down {
    grid-row: 10 / 12;
    grid-column: 3 / 10;
  }

  .up {
    grid-row: 1 / 3;
    grid-column: 3 / 10;
  }

  .left {
    grid-row : 3 / 10;
    grid-column: 1 / 3;
  }

  .right {
    grid-row: 3 / 10;
    grid-column: 10 / 12;
  }
</style>
