<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="vw/vh" />
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
  width: 50vw;
  height: 50vh;
  flex-direction: column;
  position: absolute;
  align-items: center;
  background-color: red;
}
</style>
