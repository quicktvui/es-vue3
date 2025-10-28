<template>
  <div class="es-sdk-root-css" ref="splashRootRef">
    <div class="es-sdk-splash-logo-css">
      <img class="es-sdk-splash-css" src="../../assets/logo.png" />
      <div class="es-sdk-content-column-css">
        <s-text-view text="Quick TV 3.X" />
        <span class="es-sdk-splash-title-css">API 演示项目</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESRouter, RouteResultData, RouteResult } from "@extscreen/es3-router";
import { useESDevelop, useESToast, useESLog, useES, useESDownload } from "@extscreen/es3-core";
import { ref } from "vue";

const TAG = "TESLog";

export default defineComponent({
  name: "es-splash-page",
  emits: [],
  setup() {
    const log = useESLog();
    const develop = useESDevelop();
    const router = useESRouter();
    const es = useES();
    const download = useESDownload();

    const splashRootRef = ref();
    const retData = {
      msg: "@@@@@@@@@@@@@@@",
    };

    const path = es.getESAppFilePath();
    const onESCreate = (params) => {
      let aa: string = "22222";
      log.e(TAG, "--------onESCreate-----develop->>>>>", develop.getPackageName());
      log.e(TAG, "--------onESCreate---Hello ESPlayerLog-#######->>>>>", aa, log);
      console.log("----页面路由---SPLASH----onESCreate---44444-------", params);

      // qt.toast.showToast("欢迎~~")

      setTimeout(() => {
        router.push({
          name: "index",
          resultCallback: {
            onResult(result: RouteResult): Promise<RouteResultData> | void {
              console.log(
                "----页面路由-Splash收到首页的数据--onResult---------",
                result,
                splashRootRef.value,
              );
              return Promise.resolve("我收到数据啦~~" + splashRootRef.value + "<===>" + retData);
            },
          },
        });
      }, 1500);
    };

    const onDispatchKeyEvent = (keyEvent) => {
      console.log("----页面路由---SPLASH----onDispatchKeyEvent----------", keyEvent);
    };

    function onESStart() {
      console.log("---页面路由---SPLASH---onESStart--->>>>");
    }

    function onESRestart() {
      console.log("---页面路由---SPLASH---onESRestart--->>>>");
    }

    function onESResume() {
      console.log("---页面路由---SPLASH---onESResume--->>>>");
    }

    function onESPause() {
      console.log("---页面路由---SPLASH---onESPause--->>>>");
    }

    function onESStop() {
      console.log("---页面路由---SPLASH---onESStop--->>>>");
    }

    function onESDestroy() {
      console.log("---页面路由---SPLASH----onESDestroy---->>>>>");
    }

    // const onBackPressed = () => {
    //   console.log('----页面路由---SPLASH----onBackPressed----------')
    // }

    return {
      // onBackPressed,
      onDispatchKeyEvent,
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
      onESRestart,
      splashRootRef,
    };
  },
});
</script>

<style scoped>
.es-sdk-splash-css {
  width: 300px;
  height: 300px;
}

.es-sdk-splash-logo-css {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding-bottom: 150px;
}

.es-sdk-splash-title-css {
  font-size: 50px;
  margin-top: 5px;
}
</style>
