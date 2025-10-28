import {IESManager} from "../core";
import {App} from "vue";
import {ESAppListKey} from "../useApi";
import {createESAppListModule, ESAppListModule} from "./ESAppListModule";
import {ESAppInfoList} from "./ESAppInfoList";
import {ESAppInfo} from "./ESAppInfo";

export interface ESAppList extends IESManager {

  isAppInstalled(packageName: string): Promise<boolean>

  isSystemApp(packageName: string): Promise<boolean>

  getAppList(): Promise<ESAppInfoList>

  getAppInfo(packageName: string): Promise<ESAppInfo>

  getAutoStartAppList(): Promise<Array<ESAppInfo>>
}

export function createESAppList(): ESAppList {

  const appListModule: ESAppListModule = createESAppListModule();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function isAppInstalled(packageName) {
    return appListModule.isAppInstalled(packageName);
  }

  function isSystemApp(packageName) {
    return appListModule.isSystemApp(packageName);
  }

  function getAppList() {
    return appListModule.getAppList();
  }

  function getAppInfo(packageName) {
    return appListModule.getAppInfo(packageName);
  }


  function getAutoStartAppList() {
    return appListModule.getAutoStartAppList();
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESAppListKey, instance)
    },
    init,
    isAppInstalled,
    isSystemApp,
    getAppList,
    getAppInfo,
    getAutoStartAppList,
  }
}
