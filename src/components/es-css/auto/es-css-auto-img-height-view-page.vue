<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="img auto height（view）" />
    <div class="es-sdk-content-divider-css" />
    <qt-view class="es-sdk-content-column-css css-auto-img-root-css" :clipChildren="false">
      <div>
        <img
          class="css-auto-img-css"
          src="https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
          :focusable="true"
          :enableFocusBorder="false"
          :focusScale="1.1"
        />
      </div>
      <img
        class="css-auto-img-css"
        src="https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
    </qt-view>
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
.css-auto-img-root-css {
  background-color: #fbda41;
}
.css-auto-img-css {
  width: 200px;
  /*height: 200px;*/
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
