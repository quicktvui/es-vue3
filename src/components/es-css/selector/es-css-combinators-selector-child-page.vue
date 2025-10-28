<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="后代选择器（匹配 A 的直接子元素 B）" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <es-view
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.2"
        class="es-view-root-css"
      >
        <p>嵌套更深</p>
      </es-view>
      <p>匹配直接子元素</p>
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
div > p {
  color: red;
}
.es-view-root-css {
  width: 200px;
  height: 200px;
  background-color: #40b883;
}
</style>
