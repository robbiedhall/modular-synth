<template>
  <div class="synth-controls">
    <div class="osc-controls" v-if="type === 'mono-osc'">
      <p class="osc-type">{{oscType}}</p>
      <input type="range" class="osc-type-select" step="1" min="0" max="3" v-model="settings.oscType"></input>
    </div>
    <div class="filter-controls" v-if="type === 'mono-filter'">
      <p class="filter-value">{{filterValue}} </p>
      <input type="range" class="filter-value-select" step="1" min="0" max="20000" v-model="settings.filter.value"></input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SynthControls',
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      oscTypes: ['sine', 'triangle', 'square', 'sawtooth'],
      settings: {
        oscType: '',
        filter: {
          value: 0
        }
      }
    }
  },
  computed: {
    oscType () {
      return this.type === 'mono-osc' ? this.oscTypes[this.settings.oscType] : 'N/A'
    },
    filterValue () {
      return this.settings.filter.value
    }
  },
  mounted () {
    this.settings.oscType = '0'
  }
}
</script>

<style>
.synth-controls {
  display: inline-grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  width: 100%;
  height: 100%;
  border: 1px solid white;
}
.osc-controls {
  grid-row: 3 / 5;
  grid-column:3 / 10;
  justify-content: center;
}
.osc-type {
  width:100%;
  display: block;
  text-align: center;
  padding: 0;
  margin: 0;
}
.osc-type-select {
  width: 100%;
}
.filter-controls {
  grid-row: 3 / 5;
  grid-column:3 / 10;
  justify-content: center;
}
.filter-value {
  width:100%;
  display: block;
  text-align: center;
  padding: 0;
  margin: 0;
}
.filter-value-select {
  width: 100%;
}

</style>
