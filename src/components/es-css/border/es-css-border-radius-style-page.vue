<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="radius-style" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="qt-view-focus-one"
        :focusable="true"
        :style="{ borderRadius: '20px' }"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
      <div
        class="qt-view-focus-one"
        :focusable="true"
        :style="{ borderRadius: borderRadius }"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
      <div
        class="qt-view-focus-one"
        :focusable="true"
        :style="{ borderRadius: borderRadiusNum }"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
      <div
        class="qt-view-focus-two"
        :focusable="true"
        style="border-radius: 10px 20px 30px 40px"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
// :style="{ borderRadius: '10px 20px 30px 40px' }"
// style="border-radius: 10px 20px 30px 40px;"
export default defineComponent({
  emits: [],
  setup() {
    const borderRadius = ref<string>("30px");
    const borderRadiusNum = ref<number>(60);
    return {
      borderRadius,
      borderRadiusNum,
    };
  },
});
</script>

<style scoped>
.qt-view-focus-one {
  width: 192px;
  height: 108px;
  background-color: red;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  border: 3px solid blueviolet;

  border-top-left-radius: 10px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 40px;

  focus-border: 5px solid green;

  /* 需要安卓层支持单独设置四个方向的圆角 */
  focus-border-top-left-radius: 10px;
  focus-border-top-right-radius: 20px;
  focus-border-bottom-right-radius: 30px;
  focus-border-bottom-left-radius: 40px;
}

.qt-view-focus-two {
  width: 192px;
  height: 108px;
  background-color: palevioletred;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  border: 3px solid blueviolet;

  focus-border: 5px solid green;

  /* 需要安卓层支持单独设置四个方向的圆角 */
  focus-border-radius: 10px 40px 20px 20px;
}
</style>
