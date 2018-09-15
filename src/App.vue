<template>
  <div id="app" ref="app">
    <div class="main-synth">
      <div class="component-row" v-for="(row, i) in 3" :key="i">
        <div class="component-column" v-for="(col, j) in 3" :key="j">
            <SynthComponent @completed-chain="buildSynth" @signal-transmission="distributeSignal" :ref="`module${i+1}${j+1}`" :position="`${i+1}${j+1}`" :name="`module${i+1}${j+1}`"/>
        </div>
      </div>
    </div>
    <SoundGenerator/>
    <div class="debug-window">
      <button @click="testFunc">Test</button>
      <p>Current octave: {{octave}}</p>
      <p>Current notes: {{keys}}</p>
    </div>
  </div>
</template>

<script>
import SynthComponent from './components/SynthComponent.vue'
import SoundGenerator from './components/SoundGenerator.vue'
import Tone from 'tone'
export default {
  name: 'app',
  components: {
    SynthComponent,
    SoundGenerator
  },
  data () {
    return {
      octave: 3,
      keys: {}
    }
  },
  watch: {
    keys: {
      handler (newVal, oldVal) {

      },
      deep: true
    }
  },
  created () {
    window.addEventListener('keydown', this.keyPress)
    window.addEventListener('keyup', this.keyRelease)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyPress)
    window.removeEventListener('keyup', this.keyRelease)
  },
  methods: {
    testFunc() {

    },
    buildSynth (signalObj) {
      console.log('completed chain received at main app')
      console.log(signalObj)

    },
    distributeSignal (signalTrans) {
      console.log('distributing signal')
      console.log(signalTrans)
      const refs = this.$refs
      const targets = signalTrans.targets
      for (let i = 0; i < targets.length; i++) {
        console.log('distributing signal to: ' + refs[targets[i]][0].name)
        refs[targets[i]][0].receiveSignal(signalTrans.signal)
      }
    },
    keyPress (event) {
      //Controls the keyboard octave - KEYS Z and X
      if (event.keyCode === 90 && this.octave > 0) {
          this.octave--
      } else if (event.keyCode === 88 && this.octave < 9 ) {
        this.octave++
      } else {
        const keys = this.keys
        const note = this.keyToNote(event.keyCode)
        if (!note) {
          console.log('invalid key pressed')
          return
        }
        if (keys[note]){
          // Sustain
        } else {
          //New note press
          this.$set(this.keys, note, true)
          for (let prop in this.$refs){
            let target = this.$refs[prop][0]
            if (typeof target === 'object') {
              if(target.module.type === 'key-input') {
                target.startSignal(note)
              }
            }
          }
        }
      }
    },
    keyRelease (event) {
      const keys = this.keys
      const note = this.keyToNote(event.keyCode)
      if (keys[note]) {
        // New key release
        this.$set(this.keys, note, false)
      }
    },
    keyToNote(keyCode) {
      switch(keyCode) {
        case 65:
          return `C${this.octave}`
        case 87:
          return `C#${this.octave}`
        case 83:
          return `D${this.octave}`
        case 69:
          return `D#${this.octave}`
        case 68:
          return `E${this.octave}`
        case 70:
          return `F${this.octave}`
        case 84:
          return `F#${this.octave}`
        case 71:
          return `G${this.octave}`
        case 89:
          return `G#${this.octave}`
        case 72:
          return `A${this.octave}`
        case 85:
          return `A#${this.octave}`
        case 74:
          return `B${this.octave}`
        case 75:
          return `C${this.octave+1}`
        case 79:
          return `C#${this.octave+1}`
        case 76:
          return `D${this.octave+1}`
        case 80:
          return `D#${this.octave+1}`
        case 186:
          return `E${this.octave+1}`
        case 192:
          return `F${this.octave+1}`
        default:
          return null
      }
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 880px 1fr;
  grid-template-rows: 1fr 880px 1fr;
}

.test-synth {

}
.debug-window {
  background: grey;
  color: white;
  grid-row: 1/4;
  grid-column:1/2;
  display: inline-grid;
  grid-template-rows: repeat(auto-fit, 1fr);
  font-size: 0.8rem;
}
.debug-window p{
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center
}

.debug-module {
  border: 1px dashed white;
}

.main-synth {
  grid-row: 2/3;
  grid-column: 2/3;
  display: inline-grid;
  grid-template-rows: repeat(3, 1fr);
}

.component-row {
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
}

</style>
