<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text=":focus" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div
        class="div-pseudo-classes-css"
        :focusable="true"
        :enableFocusBorder="true"
        :focusScale="1"
        @focus="onLeftFocus"
        @test="onLeftTest"
      />
      <div
        class="div-pseudo-classes-css"
        :focusable="true"
        :enableFocusBorder="true"
        :focusScale="1"
        @focus="onRightFocus"
        @test="onRightTest"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  emits: [],
  setup() {
    const onLeftFocus = (e) => {
      let focused = e.isFocused;
      console.log("---------onLeftFocus-------------->>>", focused);
    };
    const onRightFocus = (e) => {
      let focused = e.isFocused;
      console.log("---------onRightFocus-------------->>>", focused);
    };
    const onLeftTest = (e) => {
      console.log("---------onLeftTest-------------->>>", e);
    };
    const onRightTest = (e) => {
      console.log("---------onRightTest-------------->>>", e);
    };

    return {
      onLeftFocus,
      onRightFocus,
      onLeftTest,
      onRightTest,
    };
  },
});
</script>

<style scoped>
.div-pseudo-classes-css {
  width: 192px;
  height: 108px;
  margin: 20px;
  background: green;
}

.div-pseudo-classes-css:focus {
  width: 384px;
  height: 216px;
  margin: 20px;
  background: palevioletred;
}
</style>
