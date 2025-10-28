/**
 * 播放器画面比例管理
 */
import {App} from "vue";
import {ESPlayerAspectRatio} from "./ESPlayerAspectRatio";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerAspectRatioManagerKey} from "../injectionSymbols";

export interface ESPlayerAspectRatioManager extends ESIPlayerManager {

  getAspectRatio(): ESPlayerAspectRatio

  setAspectRatio(aspectRatio: ESPlayerAspectRatio): void
}

export function createESPlayerAspectRatioManager(): ESPlayerAspectRatioManager {

  let _currentAspectRatio = ESPlayerAspectRatio.ES_PLAYER_AR_ASPECT_FIT_PARENT;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function getAspectRatio(): ESPlayerAspectRatio {
    return _currentAspectRatio;
  }

  function setAspectRatio(aspectRatio: ESPlayerAspectRatio): void {
    _currentAspectRatio = aspectRatio;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerAspectRatioManagerKey, instance)
    },
    init,
    getAspectRatio,
    setAspectRatio,
  }
}
