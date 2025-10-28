<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view
      class="es-sdk-content-title-css"
      text="后代选择器（匹配 A 内的所有 B（不管嵌套几层））"
    />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <div :focusable="true" :enableFocusBorder="false" :focusScale="1.1">
        <p>内部文字内部文字内部文字内部文字内部文字</p>
      </div>
      <p>外部文字外部文字外部文字外部文字外部文字</p>
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
div p {
  color: red;
}
</style>
