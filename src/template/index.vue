<template>
  <div class="index-root-view-css">
    <div class="index-inner-css">
      <span ref="indexText">index页面</span>
    </div>
    <div class="index-inner-css">
    </div>
  </div>
</template>

<script>

import {defineComponent} from '@vue/runtime-core';

import {onMounted, ref} from "vue";

export default defineComponent({
  name: 'index',
  // mounted() {
  //
  // },
  // created() {
  // },
  setup() {
    const indexText = ref(null)

    let data = new Date().getTime();

    // const {
    //   count,
    //   double,
    //   increment
    // } = ESRouter()


    onMounted(() => {
      console.log('-----MMMIXINS------INDEX----------')
      console.log("======ROUTER4============INDEX========indexText=======>>>>>", indexText.value)
    })
    //
    // function testTestFn() {
    //   console.log('-----MMMIXINS--INDEX----testTestFn----------')
    // }


    // onESCreate(() => {
    //   console.log('-----MMMIXINS------INDEX----------')
    //   console.log("======ROUTER4============INDEX========indexText=======>>>>>", indexText.value)
    // })

    function onESRestoreInstanceState(savedInstanceState) {
      console.log('--页面路由-----INDEX_PAGE----onESRestoreInstanceState----------', savedInstanceState.data)
    }

    function onESSaveInstanceState(savedInstanceState) {
      savedInstanceState.data = "dddddddddddddddddddd"
      console.log('--页面路由-----INDEX_PAGE----onESSaveInstanceState----------', savedInstanceState)
    }

    function onESNewIntent(intent) {
      console.log('--页面路由-----INDEX_PAGE----onESNewIntent----------', data, intent)
    }

    function onESCreate(params) {
      console.log('--页面路由-----INDEX_PAGE----onESCreate----------', data, params, indexText.value)
    }

    function onESRestart() {
      console.log('--页面路由-----INDEX_PAGE----onESRestart----------', data, indexText.value)
    }

    function onESStart() {
      console.log('--页面路由-----INDEX_PAGE----onESStart----------', data, indexText.value)
    }

    function onESResume() {
      console.log('--页面路由-----INDEX_PAGE----onESResume----------', data, indexText.value)
    }

    function onESPause() {
      console.log('---页面路由----INDEX_PAGE----onESPause----------', data, indexText.value)
    }

    function onESStop() {
      console.log('---页面路由----INDEX_PAGE----onESStop----------', data, indexText.value)
    }

    function onESDestroy() {
      console.log('---页面路由----INDEX_PAGE----onESDestroy----------', data, indexText.value)
    }

    return {
      indexText,
      onESCreate,
      onESRestart,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
      onESNewIntent,
      onESRestoreInstanceState,
      onESSaveInstanceState
    }
  },
});
</script>

<style scoped>

.index-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: lightseagreen;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.index-inner-css {
  width: 192px;
  height: 108px;
  background-color: red;
}

</style>
