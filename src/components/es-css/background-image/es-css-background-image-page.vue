<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="BackgroundImage" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="background-image-css"
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
.background-image-css {
  width: 192px;
  height: 108px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 0, 0.5), rgba(0, 0, 255, 0.5));
  flex-direction: column;
  align-items: center;
}

/*background-image: linear-gradient(to bottom, rgba(255, 255, 0, 0.5), rgba(0, 0, 255, 0.5)) url("cat-front.png");*/
</style>
