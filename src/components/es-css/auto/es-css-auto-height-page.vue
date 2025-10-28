<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="height" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="css-auto-height-css"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
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
.css-auto-height-css {
  width: 100px;
  height: auto;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
