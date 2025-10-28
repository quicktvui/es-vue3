<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="Margin" />
    <div class="es-sdk-content-divider-css" />
    <div
      class="css-percentage-css"
      :focusable="true"
      :enableFocusBorder="false"
      :focusScale="1.1"
    />
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
.css-percentage-css {
  width: 50%;
  height: 50%;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
  position: absolute;
  margin-left: 50%;
  margin-top: 50%;
}
</style>
