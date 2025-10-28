<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view
      class="es-sdk-content-title-css"
      text="属性值开头选择器（Attribute Starts With Selector）"
    />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <text-view
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
        text="你好哦啊哈哈哈哈哈"
      />
      <text-view
        class="selector-div-class"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
        text="但是富家大室塑料袋解放东路时间"
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
[text^="你好"] {
  color: red;
}

.selector-div-class {
  width: 192px;
  height: 108px;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  background-color: #40b883;
}
</style>
