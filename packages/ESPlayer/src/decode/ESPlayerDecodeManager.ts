/**
 * 解码管理
 */
import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerDecodeManagerKey} from "../injectionSymbols";
import {ESPlayerDecode} from "./ESPlayerDecode";
import {ESPlayerDeviceManager} from "../device/ESPlayerDeviceManager";
import {ESPlayerDeviceType} from "../device/ESPlayerDeviceType";

export interface ESPlayerDecodeManager extends ESIPlayerManager {

  setDecode(decode: ESPlayerDecode): void

  getDecode(): ESPlayerDecode
}

export function createESPlayerDecodeManager(): ESPlayerDecodeManager {

  let currentDecode = ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE
  let playerDeviceManager: ESPlayerDeviceManager

  function init(...params: any[]): Promise<any> {
    playerDeviceManager = params[0]
    return new Promise((resolve, reject) => {
      if (playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_639) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_628) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_638) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_648) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_5508) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_9632) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_CH_9255P) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_TCL_901) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_TCL_811) ||
        playerDeviceManager.isPlayerDevice(ESPlayerDeviceType.ES_PLAYER_DEVICE_TYPE_TCL_MT07)
      ) {
        currentDecode = ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE
      } else {
        currentDecode = ESPlayerDecode.ES_PLAYER_DECODE_SOFTWARE
      }
      resolve(true);
    });
  }

  function setDecode(decode: ESPlayerDecode): void {
    currentDecode = decode;
  }

  function getDecode(): ESPlayerDecode {
    return currentDecode
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerDecodeManagerKey, instance)
    },
    init,
    setDecode,
    getDecode
  }
}
