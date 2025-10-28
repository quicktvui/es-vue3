<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="es-style-view">
        <span class="es-style-text-view">view1</span>
      </div>
      <div
        class="transform-style-class-1"
        :style="{
          width: '200px',
          height: '200px',
          backgroundColor: 'lightblue',
          transform: 'translateX(100px) rotate(45deg) scaleX(0.5)',
        }"
      >
        <span class="es-style-text-view">view2</span>
      </div>
      <div
        class="transform-style-class-2"
        style="transform: translateX(100px) rotate(45deg) scaleX(0.5)"
      >
        <span class="es-style-text-view">view3</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

// :style="{ width: '100px', height: '50px', background: 'lightblue' }"
// style="width: 100px; height: 50px; background: lightblue;"

export default defineComponent({
  name: "transform:style",
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

.transform-style-class-1 {
  width: 200px;
  height: 200px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transform-style-class-2 {
  width: 200px;
  height: 200px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
