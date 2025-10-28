<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="vh" />
    <div class="es-sdk-content-divider-css" />
    <div class="css-viewport-css" :focusable="true" :enableFocusBorder="false" :focusScale="1.1" />
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
.css-viewport-css {
  width: 960px;
  height: 50vh;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
