<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="shorthand-style" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="css-border-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
        :style="{
          border: '5px solid yellow',
          focusBorder: '5px solid red',
        }"
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
.css-border-class {
  width: 192px;
  height: 108px;
  background-color: darkgoldenrod;
  flex-direction: column;
  align-items: center;
  border-radius: 40px;
  focus-border-radius: 40px;
}
</style>
