<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-button text="打开动态引入《组合式》页面" @onButtonClicked="onButtonClicked"/>
      <s-text-button text="打开动态引入《setup》页面" @onButtonClicked="onSetupButtonClicked"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {useESRouter} from "@extscreen/es3-router";

const TAG = 'DynamicImport'

export default defineComponent({
  name: '使用初探',
  setup() {

    const router = useESRouter()

    function onButtonClicked() {
      router.push({
        name: 'dynamic-import/composition',
        params: {
          id: '123456789',
          from: 'router_first'
        },
      });
    }

    function onSetupButtonClicked() {
      router.push({
        name: 'dynamic-import/setup',
        params: {
          id: '123456',
          from: 'router_second'
        },
      });
    }

    return {
      onButtonClicked,
      onSetupButtonClicked
    }
  },
});

</script>

<style>
</style>
