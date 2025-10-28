import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESAppInfoList} from "./ESAppInfoList";
import {ESAppInfo} from "./ESAppInfo";

export interface ESAppListModule extends IESModule {

  isAppInstalled(packageName: string): Promise<boolean>

  isSystemApp(packageName: string): Promise<boolean>

  getAppList(): Promise<ESAppInfoList>

  getAppInfo(packageName: string): Promise<ESAppInfo>

  getAutoStartAppList(): Promise<Array<ESAppInfo>>
}

export function createESAppListModule(): ESAppListModule {

  function isAppInstalled(packageName) {
    return Native.callNativeWithPromise('EsNativeModule',
      'isAppInstalled', packageName)
      .then((result) => Promise.resolve(result.data));
  }

  function isSystemApp(packageName) {
    return Native.callNativeWithPromise('EsNativeModule',
      'isAppSystem', packageName)
      .then((result) => Promise.resolve(result.data));
  }

  function getAppList() {
    return Native.callNativeWithPromise('EsNativeModule',
      'getAppList');
  }

  function getAppInfo(packageName) {
    return Native.callNativeWithPromise('EsNativeModule',
      'getAppInfo', packageName);
  }

  function getAutoStartAppList() {
    return Native.callNativeWithPromise('EsNativeModule',
      'getAutoStartAppList');
  }

  return {
    isAppInstalled,
    isSystemApp,
    getAppList,
    getAppInfo,
    getAutoStartAppList,
  }
}

