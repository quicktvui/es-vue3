/**
 *
 */
import {ESPlayerPlayMode} from "@extscreen/es3-player";

export interface ESPlayerManagerPlayModeManager {

  getPlayMode(): ESPlayerPlayMode

  setPlayMode(playMode: ESPlayerPlayMode): void
}

export function createESPlayerManagerPlayModeManager(): ESPlayerManagerPlayModeManager {

  let _currentPlayMode = ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER;

  function getPlayMode(): ESPlayerPlayMode {
    return _currentPlayMode;
  }

  function setPlayMode(playMode: ESPlayerPlayMode): void {
    _currentPlayMode = playMode;
  }

  return {
    getPlayMode,
    setPlayMode,
  }
}
