<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="启动服务" @onButtonClicked="onButtonClicked(1)" />
      <s-text-button text="停止服务" @onButtonClicked="onButtonClicked(2)" />
      <s-text-button text="本地服务地址" @onButtonClicked="onButtonClicked(3)" />
      <s-text-button text="文件列表" @onButtonClicked="onButtonClicked(4)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESLogUpload, useESToast, useESXLog } from "@extscreen/es3-core";
import {
  createESAndroidHttpServerModule,
  ESAndroidServerModule,
} from "@extscreen/es3-android-local-server";

// import {ESAndroidServerModule} from "../../../packages/ESAndroidServerModule/src";
// import {createESAndroidHttpServerModule} from "../../../packages/ESAndroidServerModule";

const TAG = "HttpServerPage";

export default defineComponent({
  name: "使用初探",
  setup() {
    const log = useESXLog();
    const upload = useESLogUpload();
    const toast = useESToast();
    const params: Map<string, string> = new Map<string, string>();
    const androidServerModule: ESAndroidServerModule = createESAndroidHttpServerModule();

    function onButtonClicked(value) {
      switch (value) {
        case 1:
          androidServerModule.startServer().then((res) => {
            toast.showToast("返回结果------->" + JSON.stringify(res));
          });
          break;
        case 2:
          androidServerModule.stopServer().then((res) => {
            toast.showToast("返回结果------->" + JSON.stringify(res));
          });
          break;
        case 3:
          androidServerModule.getServer().then((res) => {
            toast.showToast("返回结果------->" + JSON.stringify(res));
          });
          break;
        case 4:
          androidServerModule.getTransferFiles().then((res) => {
            toast.showToast("返回结果------->" + JSON.stringify(res));
          });
          break;
      }
    }

    function onESCreate(params) {}

    function onESDestroy() {}

    return {
      onButtonClicked,
      onESCreate,
      onESDestroy,
    };
  },
});
</script>

<style></style>
