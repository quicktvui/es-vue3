<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="分组选择器" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <div
        class="group-selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
      <p style="width: 100px; height: 100px">测试测试</p>
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
div,
p {
  margin-bottom: 10px;
  background-color: #fbda41;
}

.group-selector-div-class {
  width: 192px;
  height: 108px;
  flex-direction: column;
  align-items: center;
}
</style>
