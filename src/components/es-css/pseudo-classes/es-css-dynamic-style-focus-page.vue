<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="动态style" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        :focusable="true"
        :enableFocusBorder="true"
        :focusScale="1"
        :style="{
          width: leftWidth,
          height: leftHeight,
          backgroundColor: leftBackgroundColor,
          margin: 20,
        }"
        @focus="onLeftFocus"
      />
      <div
        class="div-pseudo-classes-css"
        :focusable="true"
        :enableFocusBorder="true"
        :style="{
          width: rightWidth,
          height: rightHeight,
          backgroundColor: rightBackgroundColor,
          margin: 20,
        }"
        :focusScale="1"
        @focus="onRightFocus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  emits: [],
  setup() {
    const leftWidth = ref<number>(192);
    const leftHeight = ref<number>(108);
    const leftBackgroundColor = ref<string>("green");

    const rightWidth = ref<number>(192);
    const rightHeight = ref<number>(108);
    const rightBackgroundColor = ref<string>("green");

    const onLeftFocus = (e) => {
      let focused = e.isFocused;
      if (focused) {
        leftWidth.value = 384;
        leftHeight.value = 216;
        leftBackgroundColor.value = "palevioletred";
      } else {
        leftWidth.value = 192;
        leftHeight.value = 108;
        leftBackgroundColor.value = "green";
      }
    };
    const onRightFocus = (e) => {
      let focused = e.isFocused;
      if (focused) {
        rightWidth.value = 384;
        rightHeight.value = 216;
        rightBackgroundColor.value = "palevioletred";
      } else {
        rightWidth.value = 192;
        rightHeight.value = 108;
        rightBackgroundColor.value = "green";
      }
    };

    return {
      onLeftFocus,
      onRightFocus,
      leftWidth,
      leftHeight,
      leftBackgroundColor,
      rightWidth,
      rightHeight,
      rightBackgroundColor,
    };
  },
});
</script>

<style scoped></style>
