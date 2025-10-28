/**
 * 播放器画面比例管理
 */
import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerRateManagerKey} from "../injectionSymbols";
import {ESPlayerRate} from "./ESPlayerRate";

export interface ESPlayerRateManager extends ESIPlayerManager {

  getPlayRate(): ESPlayerRate

  setPlayRate(playRate: ESPlayerRate)
}

export function createESPlayerRateManager(): ESPlayerRateManager {

  let _currentPlayRate = ESPlayerRate.ES_PLAYER_RATE_1;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function getPlayRate() {
    return _currentPlayRate;
  }

  function setPlayRate(playRate) {
    _currentPlayRate = playRate;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerRateManagerKey, instance)
    },
    init,
    getPlayRate,
    setPlayRate,
  }
}
