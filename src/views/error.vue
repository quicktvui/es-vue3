<template>
  <div class="error-root-view-css">
    <div class="error-inner-css">
      <span ref="errorText">error页面</span>
    </div>
  </div>
</template>

<script>

import {defineComponent,} from '@vue/runtime-core';
import {ref} from "vue";

export default defineComponent({
  name: 'error',
  setup() {
    // const router = useESRouter();

    // const {onESPause, onESResume} = useESPage();

    // console.log("===ROUTER4===ERROR页面===============>>>>>", router)
    let data = new Date().getTime();
    const errorText = ref(null)

    function onESRestoreInstanceState(savedInstanceState) {
      console.log('--页面路由-----ERROR_PAGE----onESRestoreInstanceState----------', data, savedInstanceState)
    }

    function onESSaveInstanceState(savedInstanceState) {
      console.log('--页面路由-----ERROR_PAGE----onESSaveInstanceState----------', data, savedInstanceState)
    }

    function onESNewIntent(intent) {
      console.log('--页面路由-----ERROR_PAGE----onESNewIntent----------', data, intent)
    }

    function onESCreate(params) {
      console.log('----页面路由---ERROR_PAGE----onESCreate----------', data, params, errorText.value)
    }

    function onESRestart() {
      console.log('--页面路由-----ERROR_PAGE----onESRestart----------', data, errorText.value)
    }

    function onESStart() {
      console.log('----页面路由---ERROR_PAGE----onESStart----------', data, errorText.value)
    }

    function onESResume() {
      console.log('----页面路由---ERROR_PAGE----onESResume----------', data, errorText.value)
    }

    function onESPause() {
      console.log('----页面路由---ERROR_PAGE----onESPause----------', errorText.value)
    }

    function onESStop() {
      console.log('---页面路由----ERROR_PAGE----onESStop----------', data, errorText.value)
    }

    function onESDestroy() {
      console.log('----页面路由---ERROR_PAGE----onESDestroy----------', data, errorText.value)
    }

    // function testTestFn() {
    //   console.log('-----MMMIXINS--ERROR----testTestFn----------', errorText.value)
    // }
    //
    // onMounted(() => {
    //   console.log("===ROUTER4===ERROR页面========onMounted=======>>>>>")
    //   console.log("======ROUTER4============ERROR页面========errorText=======>>>>>", errorText.value)
    //
    //   timer = setInterval(() => {
    //     // count.value++;
    //   }, 1000);
    // });
    //
    // onUnmounted(() => {
    //   console.log("===ROUTER4===ERROR页面========onUnmounted=======>>>>>")
    //   if (timer) {
    //     clearInterval(timer);
    //   }
    // });
    return {
      errorText,
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
    };
  },
});
</script>

<style scoped>

.error-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: palevioletred;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-inner-css {
  width: 192px;
  height: 108px;
  background-color: red;
}

</style>
