<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="color" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <p class="css-variable">color</p>
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
.css-variable {
  /* RGB 用于红色 */
  --r: 255;
  --g: 0;
  --b: 128;

  /* HSL 用于绿色 */
  --h: 120;
  --s: 100%;
  --l: 50%;

  /* Alpha 值 */
  --alpha: 0.6;

  /*color: rgb(var(--r), var(--g), var(--b));       !* rgb(255, 0, 128) *!*/
  /*color: rgba(var(--r), var(--g), var(--b), var(--alpha)); !* rgba(255, 0, 128, 0.6) *!*/
  color: hsl(var(--h), var(--s), var(--l)); /* hsl(120, 100%, 50%) → 绿色 */
  /*color: hsla(var(--h), var(--s), var(--l), var(--alpha)); !* 带透明度的绿色阴影 *!*/

  width: 500px;
  height: 108px;
  background-color: palevioletred;
}
</style>
