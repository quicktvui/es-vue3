<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view
      class="es-sdk-content-title-css"
      text="属性值等于选择器（Attribute Value Equals Selector）"
    />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />

      <div
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="true"
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
[enableFocusBorder="false"] {
  background-color: red;
}

.selector-div-class {
  width: 192px;
  height: 108px;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}
</style>
