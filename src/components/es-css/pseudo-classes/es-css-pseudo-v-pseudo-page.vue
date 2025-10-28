<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="v-pseudo" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" :clipChildren="false">
      <s-text-button text="改变值" @onButtonClicked="onButtonClicked" />
      <div
        v-pseudo:test="value"
        class="div-v-pseudo-css"
        :focusable="true"
        :enableFocusBorder="true"
        :focusScale="1"
        @focus="onFocus"
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
    const value = ref<boolean>(false);

    function onButtonClicked() {
      value.value = !value.value;
    }

    const onFocus = (e) => {
      let focused = e.isFocused;
      console.log("---------onFocus-------------->>>", focused);
    };

    return {
      onFocus,
      onButtonClicked,
      value,
    };
  },
});
</script>

<style scoped>
.div-v-pseudo-css {
  width: 192px;
  height: 108px;
  margin: 20px;
  background: green;
}
/**
 <v-pseudo:abcd="value"

.div-v-pseudo-css:abcd {
  width: 384px;
  height: 216px;
  margin: 20px;
  background: palevioletred;
}
 */
.div-v-pseudo-css:test {
  width: 384px;
  height: 216px;
  margin: 20px;
  background: palevioletred;
}
</style>
