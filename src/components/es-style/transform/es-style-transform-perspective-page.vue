<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="es-style-view">
        <span class="es-style-text-view">view</span>
      </div>
      <div class="transform-perspective">
        <span class="es-style-text-view">perspective</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESLog } from "@extscreen/es3-core";

export default defineComponent({
  name: "transform:perspective",
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

.transform-perspective {
  width: 200px;
  height: 200px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 写法正确，不常用 */
  transform: perspective(500);
}
</style>
