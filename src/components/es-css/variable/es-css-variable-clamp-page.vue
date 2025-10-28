<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="clamp" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <p class="css-variable">clamp</p>
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
  width: clamp(var(--variable-size-1920), var(--variable-size-1920), var(--variable-size-300));
  height: 108px;
  background-color: #40b883;
}
</style>
