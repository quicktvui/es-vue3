<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="important" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="css-important-img-important-css css-important-img-css"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
// style="background-color: #FBDA41 !important;"
export default defineComponent({
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style scoped>
.css-important-img-important-css {
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  background-color: red !important;
}

.css-important-img-css {
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
