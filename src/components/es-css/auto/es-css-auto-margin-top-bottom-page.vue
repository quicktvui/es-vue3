<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="margin(top/bottom)" />
    <div class="es-sdk-content-divider-css" />
    <div class="auto-margin-root-css" :clipChildren="false">
      <div
        class="css-auto-margin-css"
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
.auto-margin-root-css {
  width: 1920px;
  height: 500px;
  background-color: palevioletred;
}

.css-auto-margin-css {
  width: 100px;
  height: 100px;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;

  background-color: #40b883;
}
</style>
