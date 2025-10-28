<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="es-style-view">
        <span class="es-style-text-view">view</span>
      </div>
      <div class="transform-translate">
        <span class="es-style-text-view">translate</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESLog } from "@extscreen/es3-core";

export default defineComponent({
  name: "transform:translate",
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style>
.es-style-view {
  width: 200px;
  height: 200px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.es-style-text-view {
  font-size: 40px;
}

.transform-translate {
  width: 200px;
  height: 200px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 写法错误，底层需要3个参数 */
  /*transform: translate(100);*/

  /* 写法正确，底层支持，但是有bug，不生效 */
  /*transform: translate(100, 100, 0);*/

  /* 写法正确，无问题 */
  /*transform: translateX(100);*/

  /* 写法正确，无问题 */
  /*transform: translateY(100);*/

  /* 写法正确，底层不支持百分比 */
  /*transform: translateX(-30%);*/
  /*transform: translateY(-30%);*/

  /* 写法正确，无问题 */
  transform: translateX(100px) translateY(100px);

  /* 写法正确，无问题 */
  /*transform: translateX(100) rotate(45deg);*/
}
</style>
