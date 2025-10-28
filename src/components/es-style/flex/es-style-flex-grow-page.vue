<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="container">
        <div class="es-style-1-view">
          <span class="es-style-text-view">view</span>
        </div>
        <div class="es-style-2-view">
          <span class="es-style-text-view">view</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "flex-grow",
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style scoped>
.container {
  width: 600px;
  height: 600px;
  background-color: palevioletred;
  padding: 20px;
}

.es-style-1-view {
  flex-grow: 1;
  width: 600px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-style-2-view {
  flex-grow: 3;
  width: 600px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
}

.es-style-text-view {
  font-size: 40px;
}
</style>
