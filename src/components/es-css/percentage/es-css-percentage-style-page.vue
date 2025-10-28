<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="Style" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <s-text-button text="改变尺寸" @onButtonClicked="onButtonClicked" />
      <div
        class="css-percentage-css"
        :focusable="true"
        :enableFocusBorder="false"
        :style="{ width: width, height: height }"
        :focusScale="1.1"
      >
        <div class="css-percentage-inner-css" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  emits: [],
  setup() {
    let flag: boolean = true;
    const width = ref<string>("50%");
    const height = ref<string>("50%");

    function onButtonClicked() {
      if (flag) {
        width.value = "20%";
        height.value = "20%";
      } else {
        width.value = "50%";
        height.value = "50%";
      }
      flag = !flag;
    }

    return {
      width,
      height,
      onButtonClicked,
    };
  },
});
</script>

<style scoped>
.css-percentage-css {
  flex-direction: column;
  background-color: #40b883;
}

.css-percentage-inner-css {
  width: 50%;
  height: 50%;
  background-color: #f20c00;
}
</style>
