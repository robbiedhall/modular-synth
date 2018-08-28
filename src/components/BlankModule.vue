<template>
  <div class="blank-module">
    <div class="blank-connect" v-for="(dir, key, i) in connections" v-if="connections[key]" :class="[ {'blank-in' : connections[key].in}, {'blank-out': connections[key].out}, {'blank-off': !connections[key].active},  `blank-${key}`]">
    </div>
    <div class="blank-pass-type">
      <button @click="togglePassType"><i class="fa fa-chevron-left"></i></button>
      <i v-if="passType === 'audio'" class="fa fa-volume-down"></i>
      <i v-else class="fa fa-signal"></i>
      <button @click="togglePassType"><i class="fa fa-chevron-right"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlankModule',
  props: {
    module: {
      type: Object
    }
  },
  data () {
    return {
      passType: 'audio'
    }
  },
  computed: {
    connections () {
      return this.module.connections
    }
  },
  methods: {
    togglePassType () {
      if (this.passType === 'audio') {
        this.passType = 'signal'
      } else {
        this.passType = 'audio'
      }
    }
  }
}
</script>

<style>
  .blank-module {
    width: 100%;
    height: 100%;
    color: white;
    background: black;
    display: inline-grid;
    grid-template-rows: repeat(11, 1fr);
    grid-template-columns: repeat(11, 1fr);
  }

  .blank-pass-type {
    font-size: 20px;
    text-align: center;
    align-items: center;
    grid-row: 5 / 8;
    grid-column: 5 / 8;
    display: inline-grid;
    grid-template-columns: 1fr 2fr 1fr;
    background: grey;
  }
  .blank-pass-type button {
    text-align: center;
    border: 0;
    padding: 0;
    background: transparent;
    color: white;
  }

  .blank-pass-type button:hover {
    cursor: pointer;
    background: rgba(255,255,255,0.5);
  }
  .blank-pass-type button:focus {
    border: 0;
  }


  .blank-up {
    grid-row: 3 / 5;
    grid-column: 6 / 7;
  }
  .blank-down {
    grid-row: 8 / 10;
    grid-column: 6 / 7;
  }
  .blank-left {
    grid-row: 6 / 7;
    grid-column: 3 / 5;
  }
  .blank-right {
    grid-row: 6 / 7;
    grid-column: 8 / 10;
  }
  .blank-in {
    background: blue;
  }
  .blank-off {
    background: red;
  }
  .blank-out {
    background: green;
  }
  .connect-v {
    margin-left: 2px;
    margin-right: 2px;
  }

  .connect-h {
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>
