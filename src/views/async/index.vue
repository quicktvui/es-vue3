<template>
  <div class="async-component-root-view-css">
    <span ref="testText" class="async-component-inner-text-css">异步路由根页面</span>
    <s-text-view style="margin-bottom: 20px;" :text="textRef"/>
    <div class="async-component-inner-css">
      <span ref="testText" class="async-component-inner-text-css">异步路由根页面容器</span>
      <img class="async-component-inner-img-css" :src="logo">
      <AsyncChild class="async-component-child-css"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {defineAsyncComponent, ref} from "@vue/runtime-core";
import logo from '../../assets/logo.png'

const textRef = ref("生命周期：")

const AsyncChild = defineAsyncComponent(
  () => import('../../components/es-component/es-component-child-a.vue'))

function onESCreate(params) {
  console.log("------------onESCreate----------->>>>", params)
  textRef.value = textRef.value + ' --> ' + 'onESCreate'
}

function onESStart() {
  console.log("------------onESStart----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESStart'
}

function onESNewIntent(intent) {
  console.log("------------onESNewIntent----------->>>>", intent)
  textRef.value = textRef.value + ' --> ' + 'onESNewIntent'
}

function onESRestart() {
  console.log("------------onESRestart----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESRestart'
}

function onESRestoreInstanceState(savedInstanceState) {
  console.log("------------onESRestoreInstanceState----------->>>>", savedInstanceState)
  textRef.value = textRef.value + ' --> ' + 'onESRestoreInstanceState'
}

function onESResume() {
  console.log("------------onESResume----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESResume'
}

function onESPause() {
  console.log("------------onESPause----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESPause'
}

function onESStop() {
  console.log("------------onESStop----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESStop'
}

function onESSaveInstanceState(savedInstanceState) {
  console.log("------------onESSaveInstanceState----------->>>>", savedInstanceState)
  textRef.value = textRef.value + ' --> ' + 'onESSaveInstanceState'
}

function onESDestroy() {
  console.log("------------onESDestroy----------->>>>")
  textRef.value = textRef.value + ' --> ' + 'onESDestroy'
}

defineExpose({
  onESCreate,
  onESStart,
  onESResume,
  onESPause,
  onESStop,
  onESDestroy,
  onESNewIntent,
  onESRestoreInstanceState,
  onESSaveInstanceState,
  onESRestart
})
</script>

<style scoped>

.async-component-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: teal;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.async-component-inner-css {
  width: 400px;
  height: 400px;
  background-color: yellowgreen;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.async-component-inner-text-css {
  font-size: 30px;
  margin-bottom: 20px;
}

.async-component-child-css {
  width: 200px;
  height: 200px;
  background-color: #F20C00;
}

.async-component-inner-img-css {
  width: 100px;
  height: 100px;
}

</style>
