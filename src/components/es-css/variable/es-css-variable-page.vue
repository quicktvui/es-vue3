<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="var" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <p class="css-variable">文字文字文字文字文字文字文字文字文字文字</p>
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
  --vh: 1vh;

  color: var(--primary-color);
  width: 192px;
  height: calc(var(--vh, 1vh) * 50);
  background-color: #40b883;
}
</style>
