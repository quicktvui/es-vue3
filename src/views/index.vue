<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="Quick TV 3.X API演示项目"/>
    <div class="es-sdk-content-divider-css"/>
    <div ref="root_view" class="es-sdk-content-row-css">
      <s-nav-button
        v-for="(nav, index) in navList" :key="nav.id"
        :text="nav.name"
        :url="`nav/${nav.id}`"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<script setup>
import {useESRouter, RouteResultCode} from "@extscreen/es3-router";

console.log('----页面路由---首页-------START------->>>>>')
import ESAPINavPageList from "./nav/index";

const navList = Object.keys(ESAPINavPageList).map(nav => ({
  id: nav,
  name: ESAPINavPageList[nav].name,
}))

import {onMounted} from 'vue';

const router = useESRouter()

onMounted(() => {
  console.log('------页面路由------首页----onMounted------444-------->>>>>>>');
});

const onESCreate = (params) => {
  console.log('----页面路由---首页----onESCreate----------', params)
  router.setResult({
    resultCode: RouteResultCode.ROUTE_RESULT_OK,
    data: {
      msg: 'hello~~~'
    }
  }).then((ret) => {
    console.log('------页面路由----首页---收到splash的数据----onESCreate-->>>>>>>', ret);
  })

  // const {dist: {finalize} = {}, bail} = {}//{bail : 'a', dist: {finalize : 'b'}}
  // console.log('-----#################-->>>>>>>', finalize, bail);
}

function onESDestroy() {
  console.log("---页面路由---首页----onESDestroy---->>>>>")
  router.setResult({
    resultCode: RouteResultCode.ROUTE_RESULT_OK,
    data: {
      msg: '首页要关闭页面啦啦啦啦~~~'
    }
  }).then((ret) => {
    console.log('------页面路由----首页---收到splash的数据----onESDestroy-->>>>>>>', ret);
  })
}

defineExpose({
  onESCreate,
  onESDestroy
})

console.log('----页面路由---首页-------END------->>>>>')
</script>

<style>
</style>

