<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="border" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="qt-view-focus-one"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
      <div
        class="qt-view-focus-two"
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
.qt-view-focus-one {
  width: 192px;
  height: 108px;
  background-color: darkgoldenrod;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  border-color: blueviolet;
  border-width: 5px;
  border-radius: 40px;
  focus-border-width: 5px;
  focus-border-color: blue;
  focus-border-style: solid;
  focus-border-radius: 40px;
}

.qt-view-focus-two {
  width: 192px;
  height: 108px;
  background-color: red;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  border-color: purple;
  border-width: 2px;
  border-radius: 20px;
  focus-border-width: 5px;
  focus-border-radius: 40px;
  focus-border-color: blue;
  focus-border-style: solid;
}
</style>
