<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="qt-image" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <qt-image
        class="css-auto-img-css"
        src="https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
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
    function layout(evt) {
      console.log("-----------layout---------->>>>", evt);
    }

    function loadEnd(evt) {
      console.log("-----------loadEnd---------->>>>", evt);
    }

    return {
      layout,
      loadEnd,
    };
  },
});
</script>

<style scoped>
.css-auto-img-css {
  /*width: 100px;*/
  /*height: 100px;*/
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
