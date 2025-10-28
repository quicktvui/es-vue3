<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="测试" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="es-style-view">
        <span class="es-style-text-view">view</span>
      </div>
      <div class="animation-class">
        <span class="es-style-text-view">rotate</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style>
.es-style-view {
  width: 200px;
  height: 200px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-style-text-view {
  font-size: 40px;
}

@keyframes moveRight {
  0% {
    transform: translateX(0);
    background-color: red;
  }
  50% {
    transform: translateX(100px);
    background-color: yellow;
  }
  100% {
    transform: translateX(200px);
    background-color: green;
  }
}

.animation-class {
  width: 200px;
  height: 200px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: moveRight 3s ease-in-out infinite;
}
</style>
