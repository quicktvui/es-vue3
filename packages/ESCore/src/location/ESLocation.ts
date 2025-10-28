import {IESManager} from "../core";
import {ESLocationKey} from "../useApi";
import {ESLocationInfo} from "./ESLocationInfo";
import {ESIACMessage} from "../iac";
import {ESLocationListener} from "./ESLocationListener";

import {App} from "vue";
import {EventBus, Native} from "@extscreen/es3-vue";
import {ESShareData, ESSharedDataParams} from "../share";

export interface ESLocation extends IESManager {

  getLocation(): Promise<ESLocationInfo | null>

  launchLocation(): void

  addListener(listener: ESLocationListener): void

  removeListener(listener: ESLocationListener): void
}

export function createESLocation(): ESLocation {

  let shareData: ESShareData

  const listenerList: Array<ESLocationListener> = []

  function init(...params: any[]): Promise<any> {
    shareData = params[0]
    return Promise.resolve()
  }

  function getLocation(): Promise<ESLocationInfo | null> {
    const params: ESSharedDataParams = {
      packageName: 'es.extscreen.runtime.setting'
    }
    return new Promise((resolve, reject) => {
      shareData.getString(params, 'location', '')
        .then((str) => {
            try {
              const location: ESLocationInfo = JSON.parse(str)
              resolve(location)
            } catch (e) {
              resolve(null)
            }
          },
          error => {
            reject(error)
          })
    })
  }

  function launchLocation(): void {
    Native.callNative('EsNativeModule',
      'launchEsPage', {
        pkg: 'es.extscreen.runtime.setting',
        args: {
          url: 'location'
        },
        splash: -1,
        transparent: true
      });
  }

  function addListener(listener: ESLocationListener): void {
    const index = listenerList.findIndex((l) => l === listener)
    if (index > -1) {
      return;
    }
    listenerList.push(listener)
  }

  function removeListener(listener: ESLocationListener): void {
    const index = listenerList.findIndex((l) => l === listener)
    if (index > -1) {
      listenerList.splice(index, 1);
    }
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESLocationKey, instance)
      EventBus.$on('51C16B03BB8CCDEB4CA302D15FA2B9DC', (message: ESIACMessage) => {
        const action = message.action;
        if (action !== 'onESLocationChanged') {
          return
        }
        listenerList.forEach((listener) => {
          try {
            listener.onLocationChange(message.extras)
          } catch (e) {
            console.log('onLocationChange error...', e)
          }
        });
      });
    },
    init,
    getLocation,
    launchLocation,
    addListener,
    removeListener
  }
}
