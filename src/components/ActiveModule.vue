<template>
  <div class="active-module">
    <div class="module-select">
      <button @click="toggleModuleType('left', module.name)"><i class="fa fa-chevron-left"></i></button>
      <i v-if="module.type === 'key-input'" class="fa fa-keyboard fa-3x"></i>
      <i v-if="module.type === 'audio-out'" class="fa fa-volume-up fa-3x"></i>
      <button @click="toggleModuleType('right', module.name)"><i class="fa fa-chevron-right"></i></button>
    </div>
    <div class="module-type">
      {{module.type}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActiveModule',
  props: {
    module: {
      type: Object
    }
  },
  methods: {
    toggleModuleType (dir, target) {
        this.$emit('change-module-type', dir, target)
    }
  }
}
</script>

<style>
  .active-module {
    background: purple;
    width: 100%;
    height: 100%;
    display: inline-grid;
    grid-template-rows: repeat(11, 1fr);
    grid-template-columns: repeat(11, 1fr);
  }
  .module-type {
    text-align: center;
    grid-row: 8 / 9;
    grid-column: 4 / 9
  }
  .module-select {
    grid-row: 4 / 9;
    grid-column: 4 / 9;
    display: inline-grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    text-align: center;
  }
  .module-select button {
    border: 0;
    padding: 0;
    background: transparent;
  }
  .module-select button:hover {
    cursor: pointer;
  }
</style>
