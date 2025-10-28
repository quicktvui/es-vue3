<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="Padding" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="css-percentage-css"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      >
        <div class="css-percentage-inner-css" />
      </div>
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
.css-percentage-css {
  width: 50%;
  height: 50%;
  background-color: #40b883;
  padding-left: 1%;
  padding-top: 1%;
}

.css-percentage-inner-css {
  width: 50%;
  height: 50%;
  background-color: #f20c00;
}
</style>
