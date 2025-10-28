<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="max-width" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="qt-view-focus-one" :enableFocusBorder="false">
        <div class="qt-view-focus-two" :enableFocusBorder="false" />
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
.qt-view-focus-one {
  width: auto;
  max-width: 540px;
  height: 540px;
  background-color: darkgoldenrod;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
}

.qt-view-focus-two {
  width: 25%;
  height: 108px;
  background-color: red;
  flex-direction: column;
  align-items: center;
}
</style>
