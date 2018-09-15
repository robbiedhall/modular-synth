<template>
  <div class="synth-component">
    <button class="fa fa-power-off power-button" @click="toggleModulePower" :class="[module.power ? 'power-on' : 'power-off']"/>

    <div class="connect-button" v-for="(dir, key, i) in connections" :key="i" v-if="dir" :class="[{ 'connect-ok-out' : dir.latched && dir.out }, { 'connect-ok-in' : dir.latched && dir.in }, key]" @click="toggleConnect(key)">
      <button :class="[!connections[key].active ? 'connect-off' : connections[key].in ? 'connect-in' : 'connect-out']">
        <div class="icon-group" v-if="key === 'left'">
          <i class=" fa fa-chevron-left" v-if="connections[key].active && !connections[key].in"></i>
          <i class=" fa fa-chevron-right" v-if="connections[key].active && connections[key].in"></i>
          <i class=" fa fa-times" v-if="!connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'right'">
          <i class=" fa fa-chevron-right" v-if="connections[key].active && !connections[key].in"></i>
          <i class=" fa fa-chevron-left" v-if="connections[key].active && connections[key].in"></i>
          <i class=" fa fa-times" v-if="!connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'up'">
          <i class=" fa fa-chevron-up" v-if="connections[key].active && !connections[key].in"></i>
          <i class=" fa fa-chevron-down" v-if="connections[key].active && connections[key].in"></i>
          <i class=" fa fa-times" v-if="!connections[key].active"></i>
        </div>
        <div class="icon-group" v-if="key === 'down'">
          <i class=" fa fa-chevron-up" v-if="connections[key].active && connections[key].in"></i>
          <i class=" fa fa-chevron-down" v-if="connections[key].active && !connections[key].in"></i>
          <i class=" fa fa-times" v-if="!connections[key].active"></i>
        </div>
      </button>
    </div>
    <BlankModule ref="blank" :module="module" class="module" v-if="!module.power"/>
    <ActiveModule ref="active" @change-module-type="changeModuleType" :module="module" class="module" v-if="module.power"/>
    <SynthControls ref="controls" class="synth-controls" v-if="module.power" :type="module.type"/>
  </div>


</template>

<script>

import BlankModule from './BlankModule.vue'
import ActiveModule from './ActiveModule.vue'
import SynthControls from './SynthControls.vue'
export default {
  name: 'SynthComponent',
  components: {
    BlankModule,
    ActiveModule,
    SynthControls
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
        'mono-osc',
        'mono-filter',
        'mono-amp',
        'audio-out'
      ]
    }
  },
  computed: {
    connections() {
      return this.module.connections
    },
    moduleControls () {
      if (this.module.type === "mono-osc") {
        return this.$refs['controls'].oscType
      } else if (this.module.type === 'mono-filter'){
        return this.$refs['controls'].filterValue
      } else {
        return 'not a mono or filter'
      }
    }
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
    startSignal (note) {
      if (this.module.power) {
        console.log('signal started at ' + this.module.name)
        let signalObj = {}
        signalObj.chain = []
        signalObj.chain.push({
          name: this.module.name,
          type: 'note',
          note: note
        })
        let timeStamp = new Date()
        timeStamp = timeStamp.getMilliseconds() + timeStamp.getSeconds() + timeStamp.getMinutes()
        signalObj.id = `${this.module.name}${timeStamp}`
        console.log('passing signal object to transmitSignal:')
        console.log(signalObj)
        this.transmitSignal(signalObj)
      }
    },
    receiveSignal (signalObj) {
      console.log('received signal at ' + this.module.name)
      console.log(signalObj)
      let chain = signalObj.chain
      let circ = false
      for (let i = 0; i < chain.length; i++){
        if (chain[i].name === this.module.name) {
          console.log('circular chain path found at ' + this.module.name + '. dropping signal:')
          console.log(signalObj)
          circ = true
        }
      }
      if(!circ) {
        this.processSignal(signalObj)
      }
    },
    processSignal(signalObj) {
      console.log('processing signal at ' + this.module.name)
      console.log(signalObj)
      let processedSignal = {...signalObj}
      if (this.module.power) {
        // module specific processing
        ('module specific processing at ' + this.module.name)
        if (this.module.type === 'mono-osc') {
          console.log('processing signal at mono-osc')
          processedSignal.chain.push({
            name: this.module.name,
            type: 'mono-osc',
            shape: this.moduleControls
          })
        } else if (this.module.type === 'mono-filter'){
          console.log('processing signal at mono-filter')
          processedSignal.chain.push({
            name: this.module.name,
            type: 'mono-filter',
            value: this.moduleControls
          })
        } else if (this.module.type === 'audio-out') {
          console.log('signal received at audio output at ' + this.module.name)
          console.log(signalObj)
          console.log('transmitting complete chain to main app')
          this.$emit('completed-chain', processedSignal)
          processedSignal.complete = true
        }
      } else {
        ('module inactive, pass through: ' + this.module.name)
          processedSignal.chain.push({
          name: this.module.name,
          type: 'pass'
        })
      }
      if (!processedSignal.complete){
        this.transmitSignal(processedSignal)
      }
    },
    transmitSignal(signalObj) {
      console.log('building transmission object')
      let signalTrans = {}
      signalTrans.targets = []
      let conns = this.connections
      for (let conn in conns){
        let target = conns[conn]
        if (target.out && target.latched) {
          signalTrans.targets.push(target.target.moduleName)
        }
      }
      if (signalTrans.targets.length > 0){
        signalTrans.signal = signalObj
        console.log('signal transmission built:')
        console.log(signalTrans)
        console.log('transmitting...')
        this.$emit('signal-transmission', signalTrans)
      } else {
        console.log('no valid targets for signal output at ' + this.module.name)
        console.log(signalTrans)
      }
    },
    changeModuleType (dir, moduleName) {
      let goLeft = (dir === 'left')
      let currentIndex = this.moduleTypes.findIndex(e => e === this.module.type)
      if (goLeft && currentIndex === 0) {
        this.module.type = this.moduleTypes[this.moduleTypes.length-1]
      } else if (goLeft) {
        this.module.type = this.moduleTypes[currentIndex-1]
      } else if (currentIndex === this.moduleTypes.length-1){
        this.module.type = this.moduleTypes[0]
      } else {
        this.module.type = this.moduleTypes[currentIndex+1]
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
      if (!this.module.type && !this.module.power) {
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
</script>

<style>
  .synth-component {
    display: inline-grid;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: repeat(11, 1fr);
    width: 100%;
    height: 100%;
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
  .connect-ok-out {
    border: 5px solid green;
  }

  .connect-ok-in {
    border: 5px solid blue;
  }

  .down {
    grid-row: 10 / 12;
    grid-column: 5 / 8;
  }

  .up {
    grid-row: 1 / 3;
    grid-column: 5 / 8;
  }

  .left {
    grid-row : 5 / 8;
    grid-column: 1 / 3;
  }

  .right {
    grid-row: 5 / 8;
    grid-column: 10 / 12;
  }
.synth-controls  {
  grid-row: 1 / 12;
  grid-column: 1 / 12;
}
</style>
