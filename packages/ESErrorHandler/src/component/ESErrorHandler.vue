<template>
  <modal class="error-overlay-class" v-if="state.visible" @show="show" @requestClose="close">
    <div class="error-box-class">
      <p class="error-text-class">{{ state.message }}</p>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { errorState as state } from "../core/ESErrorHandler";

function show() {
  state.visible = true;
}

function close() {
  state.visible = false;
}
</script>

<style scoped>
.error-overlay-class {
  width: 1920px;
  height: 1080px;
  position: absolute;
  align-items: center;
  justify-content: center;
}

.error-box-class {
  width: 1920px;
  height: 1080px;
  align-items: center;
  justify-content: center;
  background-color: palevioletred;
}

.error-text-class {
  color: red;
  font-size: 30px;
}
</style>
