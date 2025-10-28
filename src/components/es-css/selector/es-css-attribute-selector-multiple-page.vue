<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view
      class="es-sdk-content-title-css"
      text="多条件属性选择器（Multiple Attribute Selector）"
    />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <text-view
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        text="你好哦啊哈哈哈哈哈"
      />
      <text-view
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
        text="你好哦啊哈哈哈哈哈"
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
.selector-div-class {
  width: 192px;
  height: 108px;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
  margin: 20px;
}

[text*="哈哈"][focusScale] {
  color: deeppink;
}
</style>
