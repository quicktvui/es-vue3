import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {App} from "vue";
import {playerDeviceManagerKey} from "../injectionSymbols";
import {ESPlayerDevice} from "./ESPlayerDevice";
import {ESPlayerDeviceType} from "./ESPlayerDeviceType";

export interface ESPlayerDeviceManager extends ESIPlayerManager {

  getPlayerDevice(): ESPlayerDevice | null | undefined

  isPlayerDevice(deviceType: ESPlayerDeviceType): boolean
}

export function createESPlayerDeviceManager(): ESPlayerDeviceManager {

  let device: ESPlayerDevice | null | undefined

  function init(...params: any[]): Promise<any> {
    device = params[0]
    return Promise.resolve();
  }

  function getPlayerDevice(): ESPlayerDevice | null | undefined {
    return device
  }

  function isPlayerDevice(deviceType: ESPlayerDeviceType): boolean {
    if (device && device.deviceType) {
      return device.deviceType.includes(deviceType)
    }
    return false
  }


  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerDeviceManagerKey, instance)
    },
    init,
    getPlayerDevice,
    isPlayerDevice
  }
}
