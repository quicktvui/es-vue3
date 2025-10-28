/**
 *
 */
import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerPlayModeManagerKey} from "../injectionSymbols";
import {ESPlayerPlayMode} from "./ESPlayerPlayMode";

export interface ESPlayerPlayModeManager extends ESIPlayerManager {

  getPlayMode(): ESPlayerPlayMode

  setPlayMode(playMode: ESPlayerPlayMode): void
}

export function createESPlayerPlayModeManager(): ESPlayerPlayModeManager {

  let _currentPlayMode = ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function getPlayMode(): ESPlayerPlayMode {
    return _currentPlayMode;
  }

  function setPlayMode(playMode: ESPlayerPlayMode): void {
    _currentPlayMode = playMode;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerPlayModeManagerKey, instance)
    },
    init,
    getPlayMode,
    setPlayMode,
  }
}
