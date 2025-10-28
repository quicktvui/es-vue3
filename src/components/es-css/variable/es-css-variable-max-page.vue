<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="max" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <p class="css-variable">max</p>
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
  --variable-size-300: 300px;
  --variable-size-400: 400px;
  color: red;
  width: max(var(--variable-size-500), var(--variable-size-1920));
  height: max(10vw, var(--variable-size-400));
  background-color: #40b883;
}
</style>
