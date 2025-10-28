<template>
  <div class="es-sdk-root-css" ref="routerRootView">
    <s-title-view class="es-sdk-content-title-css" :text="'第 ' + limitCount + ' 个' + this.$options.name + ' ' + now"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-button ref="buttonRef" text="点击跳转" @onButtonClicked="onButtonClicked"/>
    </div>
  </div>
</template>

<script>

import {defineComponent,} from '@vue/runtime-core';
import {ref} from "vue";
import {useESRouter} from "@extscreen/es3-router";
import limitPageCount from "../constants/limit";

export default defineComponent({
  name: 'limit页面',
  setup() {
    const now = ref(new Date().getTime())

    const router = useESRouter()
    const buttonRef = ref(null)
    const buttonText = ref()
    const limitCount = ref(0)
    const routerRootView = ref(null)

    function onButtonClicked() {
      limitPageCount++
      router.push({
        name: 'router/router_limit_page'
      })
    }

    function onESCreate(params) {
      limitCount.value = limitPageCount
      console.log('---' + now.value + '---onESCreate---生命周期--->>>>' +
        'ref:', routerRootView, params)
    }

    function onESStart() {
      console.log('---' + now.value + '---onESStart---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onESNewIntent(intent) {
      console.log('---' + now.value + '---onESNewIntent---生命周期--->>>>' +
        'ref:', routerRootView, intent)
    }

    function onESRestart() {
      console.log('---' + now.value + '---onESRestart---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onESRestoreInstanceState(savedInstanceState) {
      console.log('---' + now.value + '---onESRestoreInstanceState---生命周期--->>>>' +
        'ref:', routerRootView, savedInstanceState)
    }

    function onESResume() {
      console.log('---' + now.value + '---onESResume---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onESPause() {
      console.log('---' + now.value + '---onESPause---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onESStop() {
      console.log('---' + now.value + '---onESStop---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onESSaveInstanceState(savedInstanceState) {
      console.log('---' + now.value + '---onESSaveInstanceState---生命周期--->>>>' +
        'ref:', routerRootView, savedInstanceState)
    }

    function onESDestroy() {
      console.log('---' + now.value + '---onESDestroy---生命周期--->>>>' + 'ref:', routerRootView)
    }

    function onBackPressed() {
      limitPageCount--
      router.back()
    }

    return {
      now,
      buttonRef,
      buttonText,
      limitCount,
      routerRootView,
      onButtonClicked,
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
      onESRestoreInstanceState,
      onESSaveInstanceState,
      onESRestart,
      onBackPressed
    };
  },
});
</script>

<style scoped>


</style>
