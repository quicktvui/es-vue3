<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="GradientBackgroundImage" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="background-image-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
        :gradientBackground="{
          type: 0,
          shape: 0,
          colors: ['#FFff0000', '#FF00ff00', '#ff0000', '#00ff00'],
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

// android color
// colors: ['#FFff0000', '#FF00ff00'],

//十六进制颜色值
// colors: ['#ff0000', '#00ff00'],

//named color
// colors: ['red', 'green','yellow'],

//rgb & rgba
// colors: ['rgb(255, 0, 255)', 'rgba(255, 255, 255, 1.0)'],

//hsl & hsla
// colors: ['hsl(360, 100%, 100%)',  'hsla(360, 80%, 20%, 1.0)'],

export default defineComponent({
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style scoped>
.background-image-class {
  width: 960px;
  height: 540px;
  background-color: transparent;
  flex-direction: column;
  align-items: center;
}
</style>
