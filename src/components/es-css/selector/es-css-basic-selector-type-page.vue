<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="元素选择器" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="selector-div-class"
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
div {
  background: palevioletred;
}
.selector-div-class {
  width: 192px;
  height: 108px;
  flex-direction: column;
  align-items: center;
}
</style>
