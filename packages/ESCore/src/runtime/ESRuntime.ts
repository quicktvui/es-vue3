import {IESManager} from "../core";
import {App} from "vue";
import {ESRuntimeKey} from "../useApi";
import {
  createESRuntimeDeviceModule,
  createESRuntimeDevicePluginModule,
  ESRuntimeDeviceInfo
} from "./ESRuntimeDeviceModule";
import {ES, ESVersion} from "../es";
import {ESPlugin, ESPluginListener, ESPluginInfo} from "../plugin";
import {Native} from "@extscreen/es3-vue";
import {ESRuntimeDeviceType} from "./ESRuntimeDeviceType";

export interface ESRuntime extends IESManager {

  getRuntimeDeviceInfo(): ESRuntimeDeviceInfo | null;

  getRuntimeDeviceId(): string | null

  getRuntimeDeviceType(): string | null

  isUserPrivacyDisplayed(packageName: String): Promise<boolean>

  isRuntimeDevice(deviceType: ESRuntimeDeviceType): boolean
}

export function createESRuntimeDevice(): ESRuntime {

  const runtimeDeviceModule = createESRuntimeDeviceModule();
  const runtimeDevicePluginModule = createESRuntimeDevicePluginModule();

  let runtimeDeviceInfo: ESRuntimeDeviceInfo | null

  let esManager: ES
  let plugin: ESPlugin
  const pluginInfo: ESPluginInfo = {
    pkg: 'eskit.plugin.runtime'
  }

  const listener: ESPluginListener = {

    onPluginInstallSuccess(pkg: string, status: number, msg: string) {
      runtimeDevicePluginModule.getRuntimeDeviceInfo()
        .then(
          (result) => {
            runtimeDeviceInfo = result;
          },
          error => {
          }
        );
    },
    onPluginInstallProgress(pkg: string, status: number, current: number, total: number) {
    },
    onPluginInstallError(pkg: string, status: number, msg: string) {
      runtimeDeviceModule.getRuntimeDeviceInfo()
        .then(
          (result) => {
            runtimeDeviceInfo = result;
          },
          error => {
          }
        );
    },
  }

  function init(...params: any[]): Promise<any> {
    esManager = params[0]
    plugin = params[1]
    return new Promise((resolve, reject) => {
      if (esManager.getESSDKVersionCode() < ESVersion.ES_SDK_VERSION_22) {
        plugin.addListener(pluginInfo, listener)
        plugin.installPlugin(pluginInfo)
        resolve(true);
      } else {
        runtimeDeviceModule.getRuntimeDeviceInfo()
          .then(
            (result) => {
              runtimeDeviceInfo = result;
              resolve(true);
            },
            error => {
              resolve(false);
            }
          );
      }
    });
  }

  function getRuntimeDeviceInfo() {
    return runtimeDeviceInfo
  }

  function getRuntimeDeviceId() {
    if (runtimeDeviceInfo) {
      return runtimeDeviceInfo.deviceId
    }

    return null
  }

  function getRuntimeDeviceType() {
    if (runtimeDeviceInfo) {
      return runtimeDeviceInfo.deviceType
    }
    return null
  }

  function isUserPrivacyDisplayed(packageName) {
    if (esManager.getESSDKVersionCode() < ESVersion.ES_SDK_VERSION_22_1) {
      return Promise.resolve(false)
    } else {
      return esManager.isModuleRegistered('com.extscreen.runtime.module.AppUtilsModule')
        .then((reg) => {
            if (reg) {
              return Native.callNativeWithPromise(
                'AppUtilsModule', 'isShowPolicy', packageName);
            } else {
              return Native.callNativeWithPromise(
                'EsNativeModule', 'isShowPolicy', packageName);
            }
          },
          error => {
            return Native.callNativeWithPromise(
              'EsNativeModule', 'isShowPolicy', packageName);
          }
        );
    }
  }

  function isRuntimeDevice(deviceType: ESRuntimeDeviceType): boolean {
    if (runtimeDeviceInfo && runtimeDeviceInfo.deviceType) {
      return runtimeDeviceInfo.deviceType.includes(deviceType)
    }
    return false
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESRuntimeKey, instance)
    },
    init,
    getRuntimeDeviceInfo,
    getRuntimeDeviceId,
    getRuntimeDeviceType,
    isUserPrivacyDisplayed,
    isRuntimeDevice,
  }
}
