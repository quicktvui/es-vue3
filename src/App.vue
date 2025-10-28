<template>
  <div id="root">
    <es-slot-view v-if="enableSlot" />
    <es-router-view v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {
  ESAppParams,
  ESLogLevel,
  useESDevice,
  useESLog,
  useESNetwork,
  useESRuntime,
  useESToast,
  ESNetworkInfo,
  ESNetworkListener,
} from "@extscreen/es3-core";
import { ESPlayerConfiguration, ESPlayerDisplay, useESPlayer } from "@extscreen/es3-player";
import { ESXLogLevel, useESXLog, useESRouterManager } from "@extscreen/es3-core";
import { ESApp, EventBus, onESDestroy } from "@extscreen/es3-vue";
import { useESRouter } from "@extscreen/es3-router";
import { onMounted, ref } from "vue";
import BuildConfig from "./build/BuildConfig";
import {
  ESPaymentInfo,
  HisensePayInfo,
  HisenseTokenInfo,
  HisenseUserInfo,
  PayChannel,
  PayOpenType,
  useESHisensePayments,
} from "@extscreen/es3-pay";

export default defineComponent({
  name: "App",
  emits: [],
  setup() {
    //
    const enableSlot = ref<Boolean>(BuildConfig.enableSlotView);
    //
    const log = useESLog();
    log.setMinimumLoggingLevel(ESLogLevel.DEBUG);
    log.enableConsoleLogging(true);

    //
    const network = useESNetwork();
    const toast = useESToast();

    //
    const logx = useESXLog();
    logx.setMinimumLoggingLevel(ESXLogLevel.DEBUG);

    const playerManager = useESPlayer();
    const runtime = useESRuntime();
    const device = useESDevice();

    const router = useESRouter();
    const hisensePayUtil = useESHisensePayments();

    //控制是否自动跳转到首页
    const routerManager = useESRouterManager();
    routerManager.setAutoRedirectEnabled(true);

    let isCreated = false;
    let launchParamsList = [];

    const connectivityChangeListener: ESNetworkListener = {
      onConnectivityChange(networkInfo: ESNetworkInfo | null) {
        toast.showToast("网络:" + JSON.stringify(networkInfo));
      },
    };

    function onESCreate(app: ESApp, params?: ESAppParams) {
      console.log("---应用生命周期----app-------onESCreate------>>>>>", app, params);
      network.addListener(connectivityChangeListener);

      EventBus.$off("launchEsPage");
      EventBus.$on("launchEsPage", (event) => {
        try {
          launchParamsList.push(event);
          if (isCreated && launchParamsList.length > 0) {
            for (let i = 0; i < launchParamsList.length; i++) {
              const route = launchParamsList[i];
              setTimeout(
                () => {
                  router.push({
                    name: route.url,
                    params: route.params,
                  });
                },
                (i + 1) * 500,
              );
            }
            launchParamsList = [];
          }
        } catch (e) {}
      });

      //=======================================================
      //       router.push({
      //         name: 'yellow',
      //         key: 'sid_1',
      //         params: {}
      //       })
      //
      //       setTimeout(() => {
      //         router.push({
      //           name: 'blue',
      //           key: 'sid_2',
      //           params: {}
      //         })
      //       }, 2000)
      //
      //       setTimeout(() => {
      //         router.push({
      //           name: 'purple',
      //           key: 'sid_3',
      //           params: {}
      //         })
      //       }, 3000)
      //
      //       setTimeout(() => {
      //         router.push({
      //           name: 'red',
      //           key: 'sid_4',
      //           params: {}
      //         })
      //       }, 4000)
      //=======================================================
      // setTimeout(() => {
      //   router.splice({
      //     name: 'red',
      //     key: 'sid_4',
      //     params: {
      //       sid: 'sid_4'
      //     }
      //   })
      // }, 5000)
      // setTimeout(() => {
      //   router.splice({
      //     name: 'purple',
      //     key: 'sid_3',
      //     params: {}
      //   })
      // }, 5000)
      //=======================================================

      return Promise.resolve().then(() => {
        const playerDisplay: ESPlayerDisplay = {
          screenWidth: device.getScreenWidth(),
          screenHeight: device.getScreenHeight(),
        };
        const config: ESPlayerConfiguration = {
          debug: true,
          display: playerDisplay,
          device: {
            deviceType: runtime.getRuntimeDeviceType() ?? "",
          },
        };
        return playerManager.init(config);
      });
    }

    function onESCreated(success: boolean) {
      console.log("---应用生命周期---app-------onESCreated---->>>>>", success);
      isCreated = true;
      if (launchParamsList.length > 0) {
        for (let i = 0; i < launchParamsList.length; i++) {
          const route = launchParamsList[i];
          setTimeout(
            () => {
              console.log("===3===launchEsPage=======>>>>", route.url);
              router.push({
                name: route.url,
                params: route.params,
              });
            },
            (i + 1) * 500,
          );
        }
        launchParamsList = [];
      }
    }

    function onESStart() {
      console.log("---应用生命周期---app-------onESStart---->>>>>");
    }

    function onESNewIntent(intent) {
      console.log("---应用生命周期---app-------onESNewIntent---->>>>>", intent);
    }

    function onESRestart() {
      console.log("---应用生命周期---app-------onESRestart---->>>>>");
    }

    function onESResume() {
      console.log("---应用生命周期---app-------onESResume---->>>>>");
    }

    function onESPause() {
      console.log("---应用生命周期---app-------onESPause---->>>>>");
    }

    function onESStop() {
      console.log("---应用生命周期---app-------onESStop---->>>>>");
    }

    // function onESDestroy() {
    //   console.log("---应用生命周期---app-------onESDestroy---->>>>>");
    // }

    onESDestroy(() => {
      console.log("---应用生命周期---app----xx---onESDestroy---->>>>>");
    });
    onMounted(() => {
      console.log("---应用生命周期---app----xx---onMounted---->>>>>");
    });

    return {
      enableSlot,
      onESCreate,
      onESCreated,
      onESStart,
      onESNewIntent,
      onESRestart,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
    };
  },
});
</script>

<style scoped>
#root {
  --primary-color: red;
  --variable-size-500: 500px;
  --variable-size-1920: 1920px;

  width: 1920px;
  height: 1080px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
