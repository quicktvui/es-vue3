<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view
      class="es-sdk-content-title-css"
      text="相邻兄弟选择器（匹配 紧挨着 A 的下一个 B）"
    />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <div :focusable="true" :enableFocusBorder="false" :focusScale="1.1">
        <p>效果：第一个 p 红色，第二个 p 不变。</p>
      </div>
      <p>外部文字一外部文字一外部文字一外部文字一外部文字一外部文字一外部文字一</p>
      <p>外部文字二外部文字二外部文字二外部文字二外部文字二外部文字二外部文字二</p>
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
div + p {
  color: red;
}
</style>
