<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="动态class" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        :class="leftFocused ? 'div-dynamic-classes-focus-css' : 'div-dynamic-classes-css'"
        :focusable="true"
        :enableFocusBorder="true"
        :focusScale="1"
        @focus="onLeftFocus"
      />
      <div
        :class="rightFocused ? 'div-dynamic-classes-focus-css' : 'div-dynamic-classes-css'"
        class="div-pseudo-classes-css"
        :focusable="true"
        :enableFocusBorder="true"
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
    const leftFocused = ref<boolean>(false);
    const rightFocused = ref<boolean>(false);

    const onLeftFocus = (e) => {
      let focused = e.isFocused;
      leftFocused.value = focused;
      console.log("---------onLeftFocus-------------->>>", focused);
    };
    const onRightFocus = (e) => {
      let focused = e.isFocused;
      rightFocused.value = focused;
      console.log("---------onRightFocus-------------->>>", focused);
    };

    return {
      onLeftFocus,
      onRightFocus,
      leftFocused,
      rightFocused,
    };
  },
});
</script>

<style scoped>
.div-dynamic-classes-css {
  width: 192px;
  height: 108px;
  margin: 20px;
  background: green;
}

.div-dynamic-classes-focus-css {
  width: 384px;
  height: 216px;
  margin: 20px;
  background: palevioletred;
}
</style>
