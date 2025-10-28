<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-view text="Text"></s-text-view>
      <s-text-button text="是否注册" @onButtonClicked="onRegisterClicked"/>
      <s-text-button text="安装插件" @onButtonClicked="onPluginClicked"/>
      <s-text-button text="初始化" @onButtonClicked="onInitClicked"/>
      <s-text-button text="打日志" @onButtonClicked="onLogClicked"/>
      <s-text-button text="刷新" @onButtonClicked="onFlushClicked"/>
      <s-text-button text="发送" @onButtonClicked="onSendClicked"/>
      <s-text-button text="检测任务" @onButtonClicked="onDetectClicked"/>
      <s-text-button text="获取发送" @onButtonClicked="onGetSendClicked"/>
      <s-text-button text="获取全部" @onButtonClicked="onAllClicked"/>
      <s-text-button text="获取版本" @onButtonClicked="onVersionClicked"/>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/runtime-core";
import {
  useES,
  useESPlugin,
  useESToast,
  useESHLog, ESHLogType, ESHLogLevel
} from "@extscreen/es3-core";

export default defineComponent({
  name: "hlog日志",
  setup() {
    // EventBus.$on("onDetectResult", s => {
    //   console.log("onDetectResult " + s)
    // });
    //
    // EventBus.$on("onSendStart", s => {
    //   console.log("onSendStart " + s)
    // });
    // EventBus.$on("onSendCancel", () => {
    //   console.log("onSendCancel")
    // });
    // EventBus.$on("onSendComplete", () => {
    //   console.log("onSendComplete")
    // });
    // EventBus.$on("onSendFail", s => {
    //   console.log("onSendFail " + s)
    // });
    //
    // EventBus.$on("onItemSendStart", map => {
    //   console.log("onItemSendStart " + JSON.stringify(map))
    // });
    // EventBus.$on("onItemProgress", map => {
    //   console.log("onItemProgress " + JSON.stringify(map))
    // });
    // EventBus.$on("onItemSuccess", map => {
    //   console.log("onItemSuccess " + map)
    // });
    // EventBus.$on("onItemFail", map => {
    //   console.log("onItemFail " + JSON.stringify(map))
    // });
    // EventBus.$on("onItemPostSuccess", map => {
    //   console.log("onItemPostSuccess " + map)
    // });
    // EventBus.$on("onItemPostFail", map => {
    //   console.log("onItemPostFail " + map)
    // });

    const es = useES();
    const plugin = useESPlugin()
    const toast = useESToast()
    const hLog = useESHLog()

    const sss = {
      onDetectTaskListener(data) {
        console.log("onDetectTaskListener " + JSON.stringify(data))
      },

      onStartListener(data) {
        console.log("onStartListener " + JSON.stringify(data))
      },

      onCancelListener() {
        console.log("onCancelListener")
      },

      onCompleteListener() {
        console.log("onCompleteListener")
      },

      onFailListener(data) {
        console.log("onFailListener " + JSON.stringify(data))
      },

      // onItemStartListener(data) {
      //   console.log("onItemStartListener " + JSON.stringify(data))
      // },
      //
      // onItemProgressListener(data) {
      //   console.log("onItemProgressListener " + JSON.stringify(data))
      // },
      //
      // onItemSuccessListener(data) {
      //   console.log("onItemSuccessListener " + JSON.stringify(data))
      // },
      //
      // onItemFailListener(data) {
      //   console.log("onItemFailListener " + JSON.stringify(data))
      // },
      //
      onItemPostSuccessListener(data) {
        console.log("onItemPostSuccessListener " + JSON.stringify(data))
      },
      //
      // onItemPostFailListener(data) {
      //   console.log("onItemPostFailListener " + JSON.stringify(data))
      // }
    }

    hLog.setOnUploadListener(sss)

    // hLog.setOnUploadListener2(({eventName, data}) => {
    //   console.log("setOnUploadListener2 " + eventName + " " + JSON.stringify(data))
    // })

    // hLog.setOnDetectTaskListener((data)=> {
    //   console.log("setOnDetectTaskListener " + JSON.stringify(data))
    // })
    hLog.setOnStartListener((data) => {
      console.log("setOnStartListener " + JSON.stringify(data))
    })
    // hLog.setOnCancelListener(()=> {
    //   console.log("setOnCancelListener")
    // })
    // hLog.setOnCompleteListener(()=> {
    //   console.log("setOnCompleteListener")
    // })
    // hLog.setOnFailListener((data)=> {
    //   console.log("setOnFailListener " + JSON.stringify(data))
    // })
    //
    // hLog.setOnItemStartListener((data)=> {
    //   console.log("setOnItemStartListener " + JSON.stringify(data))
    // })
    hLog.setOnItemProgressListener((data) => {
      console.log("setOnItemProgressListener " + JSON.stringify(data))
    })
    // hLog.setOnItemSuccessListener((data)=> {
    //   console.log("setOnItemSuccessListener " + JSON.stringify(data))
    // })
    // hLog.setOnItemFailListener((data)=> {
    //   console.log("setOnItemFailListener " + JSON.stringify(data))
    // })
    //
    // hLog.setOnItemPostSuccessListener((data)=> {
    //   console.log("setOnItemPostSuccessListener " + JSON.stringify(data))
    // })
    // hLog.setOnItemPostFailListener((data)=> {
    //   console.log("setOnItemPostFailListener " + JSON.stringify(data))
    // })

    function onRegisterClicked() {
      es.isModuleRegistered(hLog.getModuleName())
        .then(res => {
          toast.showLongToast("是否注册：" + res)
        })
    }

    function onPluginClicked() {
      const info = {pkg: hLog.getPluginName()}
      plugin.addListener(info, {
        onPluginInstallProgress(pkg, status, current, total) {
          toast.showLongToast("onPluginInstallProgress")
        },

        onPluginInstallSuccess(pkg, status, msg) {
          toast.showLongToast("onPluginInstallSuccess")
        },

        onPluginInstallError(pkg, status, msg) {
          toast.showLongToast("onPluginInstallError")
        }
      })
      plugin.installPlugin(info)
    }

    function onInitClicked() {
      hLog.setUserId('')
      hLog.setLogType(ESHLogType.LOG_TYPE_X_LOG)
      hLog.setLogLevel(ESHLogLevel.LEVEL_VERBOSE)
      hLog.initLog().then(() => {
        console.log("initLog 成功")
      })
    }

    function onLogClicked() {
      hLog.v('VVUE', 'vue端v的日志')
      hLog.i('VVUE', 'vue端d的日志')
      hLog.d('VVUE', 'vue端i的日志')
      hLog.w('VVUE', 'vue端w的日志')
      hLog.e('VVUE', 'vue端e的日志')
    }

    function onFlushClicked() {
      hLog.flush()
    }

    function onSendClicked() {
      hLog.upLoad(['2024-12-17', '2024-12-19'])
    }

    function onDetectClicked() {
      hLog.detectTask()
    }

    function onGetSendClicked() {
      hLog.getSendFilePath(['2024-12-17']).then(res => {
        toast.showLongToast(res.length)
      })
        .catch(e => {
          toast.showLongToast(e)
        })
    }

    function onAllClicked() {
      hLog.getAllFileInfo().then(res => {
        toast.showLongToast(res.length)
      })
        .catch(e => {
          toast.showLongToast(e)
        })
    }

    function onVersionClicked() {
      hLog.getVersion().then(res => toast.showLongToast(res))
    }

    return {
      onRegisterClicked,
      onPluginClicked,
      onInitClicked,
      onLogClicked,
      onFlushClicked,
      onSendClicked,
      onDetectClicked,
      onGetSendClicked,
      onAllClicked,
      onVersionClicked,
    }
  },
});
</script>

<style scoped>

</style>
