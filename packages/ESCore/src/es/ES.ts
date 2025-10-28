import {IESManager} from "../core";
import {App} from "vue";
import {ESKey} from "../useApi";
import {createESModule, ESModule} from "./ESModule";
import {ESSDKInfo} from "./ESSDKInfo";
import {ESDeviceInfo} from "../device";

export interface ES extends IESManager {

  getESSDKInfo(): ESSDKInfo

  getESId(): string

  getESName(): string

  getESSDKVersionCode(): number

  getESSDKVersionName(): string

  getESPackageName(): string

  /**
   * 获取EsApp路径, 用于文件存储管理
   * @return
   * /data/data/APK包名/app_rpk/apps/小程序包名/files
   * 示例:/data/data/com.extscreen.runtime/app_rpk/apps/es.com.baduanjin.tv/files
   */
  getESAppFilePath(): string

  /**
   * 获取EsApp运行时路径, 通常用于获取代码包里的assets
   * @return
   * /data/data/APK包名/app_rpk/apps/小程序包名/版本号/android
   * 示例:/data/data/com.extscreen.runtime/app_rpk/apps/es.com.baduanjin.tv/2.2.2203/android
   */
  getESAppRuntimePath(): string

  getSupportSchemes(): Array<string>

  isModuleRegistered(className: string): Promise<boolean>

  isComponentRegistered(className: string): Promise<boolean>
}

export function createES(): ES {

  let esModule: ESModule = createESModule()

  let esSDKInfo: ESSDKInfo
  let packageName: string

  function init(...params: any[]): Promise<any> {
    return esModule.getESSDKInfo()
      .then((result) => {
        esSDKInfo = result;
      })
      .then(esModule.getESPackageName)
      .then((pkg) => {
        packageName = pkg;
      })
      .then(esModule.getESDeviceInfo)
      .then((deviceInfo: ESDeviceInfo) => {
        if (esSDKInfo && deviceInfo.cid) {
          esSDKInfo.cid = deviceInfo.cid
          esSDKInfo.IPAddress = deviceInfo.device_ip
          esSDKInfo.deviceName = deviceInfo.device_name
        }
        return Promise.resolve()
      })
  }

  function getESSDKInfo(): ESSDKInfo {
    return esSDKInfo
  }

  function getESId(): string {
    return esSDKInfo.cid
  }

  function getESName(): string {
    return esSDKInfo.deviceName
  }

  function getESSDKVersionCode(): number {
    return esSDKInfo.eskit_ver_code
  }

  function getESSDKVersionName(): string {
    return esSDKInfo.eskit_ver_name
  }

  function getESPackageName(): string {
    return packageName
  }

  function getESAppFilePath(): string {
    return esSDKInfo.miniProgramPath
  }

  function getESAppRuntimePath(): string {
    return esSDKInfo.runtimePath
  }

  function getSupportSchemes(): Array<string> {
    return esSDKInfo.schemes
  }

  function isModuleRegistered(className: string): Promise<boolean> {
    return esModule.isModuleRegistered(className);
  }

  function isComponentRegistered(className: string): Promise<boolean> {
    return esModule.isComponentRegistered(className);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESKey, instance)
    },
    init,
    getESSDKInfo,
    getESId,
    getESName,
    getESSDKVersionCode,
    getESSDKVersionName,
    getESPackageName,
    getESAppFilePath,
    getESAppRuntimePath,
    getSupportSchemes,
    isModuleRegistered,
    isComponentRegistered,
  }
}

