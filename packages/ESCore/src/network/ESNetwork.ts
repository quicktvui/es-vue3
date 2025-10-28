import {IESManager} from "../core";
import {App} from "vue";
import {ESNetworkKey} from "../useApi";
import {createESNetworkModule, ESNetworkModule} from "./ESNetworkModule";
import {EventBus} from "@extscreen/es3-vue";
import {ESNetworkListener} from "./ESNetworkListener";
import {ESNetworkInfo} from "./ESNetworkInfo";
import {ESWifiInfo} from "./ESWifiInfo";

export interface ESNetwork extends IESManager {

  getActiveNetworkInfo(): ESNetworkInfo | null

  isNetworkConnected(): boolean

  getWifiInfo(): Promise<ESWifiInfo>

  addListener(listener: ESNetworkListener): void

  removeListener(listener: ESNetworkListener): void
}

export function createESNetwork(): ESNetwork {

  let networkInfo: ESNetworkInfo | null
  const networkModule: ESNetworkModule = createESNetworkModule()
  const listenerList: Array<ESNetworkListener> = []

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      networkModule.getActiveNetworkInfo().then(
        (result) => {
          networkInfo = result;
          resolve(networkInfo);
        },
        error => {
          networkInfo = null;
          resolve(networkInfo);
        }
      );
    });
  }

  function getActiveNetworkInfo() {
    return networkInfo
  }

  function isNetworkConnected() {
    return networkInfo != null && networkInfo.isConnected;
  }

  function getWifiInfo(): Promise<ESWifiInfo> {
    return networkModule.getWifiInfo()
  }

  function addListener(listener) {
    const index = listenerList.findIndex((l) => l === listener)
    if (index > -1) {
      return;
    }
    listenerList.push(listener)
  }

  function removeListener(listener) {
    const index = listenerList.findIndex((l) => l === listener)
    if (index > -1) {
      listenerList.splice(index, 1);
    }
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESNetworkKey, instance)
      EventBus.$on('onConnectivityChanged', (info) => {
        networkInfo = info;
        listenerList.forEach((listener) => {
          try {
            listener.onConnectivityChange(networkInfo)
          } catch (e) {
          }
        });
      });
    },
    init,
    getActiveNetworkInfo,
    getWifiInfo,
    isNetworkConnected,
    addListener,
    removeListener,
  }
}
