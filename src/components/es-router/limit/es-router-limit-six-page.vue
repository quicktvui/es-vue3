<template>
  <div class="es-sdk-root-css" ref="routerRootView">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name + now"/>
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

export default defineComponent({
  name: '第六个limit页面',
  setup() {
    const now = ref('')

    console.log('---第六个limit页面---setup---生命周期--->>>>')

    const router = useESRouter()
    const buttonRef = ref(null)
    const buttonText = ref()
    const routerRootView = ref(null)

    function onButtonClicked() {
      // router.push({
      //   name: 'router/router_limit_page'
      // })
    }

    function onESCreate(params) {
      now.value = new Date().getTime() + ''
      console.log('---第五个limit页面---onESCreate---生命周期--->>>>', params)
    }

    function onESStart() {
      console.log('---第五个limit页面--onESStart---生命周期--->>>>')
    }

    function onESNewIntent(intent) {
      console.log('---第五个limit页面---onESNewIntent---生命周期--->>>>', intent)
    }

    function onESRestart() {
      console.log('---第五个limit页面---onESRestart---生命周期--->>>>')
    }

    function onESRestoreInstanceState(savedInstanceState) {
      console.log('---第五个limit页面---onESRestoreInstanceState---生命周期--->>>>', savedInstanceState)
    }

    function onESResume() {
      console.log('---第五个limit页面--onESResume---生命周期--->>>>')
    }

    function onESPause() {
      console.log('---第五个limit页面---onESPause---生命周期--->>>>')
    }

    function onESStop() {
      console.log('---第五个limit页面---onESStop---生命周期--->>>>')
    }

    function onESSaveInstanceState(savedInstanceState) {
      console.log('---第五个limit页面---onESSaveInstanceState---生命周期--->>>>', savedInstanceState)
    }

    function onESDestroy() {
      console.log('---第五个limit页面---onESDestroy---生命周期--->>>>')
    }

    function onBackPressed() {
      router.back()
    }

    return {
      now,
      buttonRef,
      buttonText,
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
