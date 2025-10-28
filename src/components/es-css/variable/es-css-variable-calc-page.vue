<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="calc" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <p class="css-variable">计算计算计算计算计算计算计算计算计算计算计算计算</p>
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

<style scoped>
.css-variable {
  color: red;
  width: calc(var(--variable-size-500) + 500);
  height: calc(25vh * 2);
  background-color: #40b883;
}
</style>
