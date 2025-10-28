<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="test" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <es-view class="border-css" :focusable="true" :enableFocusBorder="false" :focusScale="1.1" />
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
.border-css {
  width: 192px;
  height: 108px;
  background-color: darkgoldenrod;

  border-style: solid;
  border-color: red;

  /* border-left-width和border-radius这种写法会导致边框出不来 */
  border-left-width: 2px;
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 2px;
  /**/
  border-radius: 4px;
}
</style>
