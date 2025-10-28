/**
 * 播放器类型管理
 */
import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerTypeManagerKey} from "../injectionSymbols";
import {ESPlayerType} from "./ESPlayerType";
import {ESPlayerDeviceManager} from "../device/ESPlayerDeviceManager";
import {ESPlayerDeviceType} from "../device/ESPlayerDeviceType";

export interface ESPlayerTypeManager extends ESIPlayerManager {

  setPlayerType(type: ESPlayerType): void

  getPlayerType(): ESPlayerType
}

export function createESPlayerTypeManager(): ESPlayerTypeManager {

  let currentPlayerType = ESPlayerType.ES_PLAYER_TYPE_SYSTEM
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
        currentPlayerType = ESPlayerType.ES_PLAYER_TYPE_SYSTEM
      } else {
        currentPlayerType = ESPlayerType.ES_PLAYER_TYPE_IJK
      }
      resolve(true);
    });
  }

  function setPlayerType(type: ESPlayerType): void {
    currentPlayerType = type;
  }

  function getPlayerType(): ESPlayerType {
    return currentPlayerType
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerTypeManagerKey, instance)
    },
    init,
    setPlayerType,
    getPlayerType
  }
}
