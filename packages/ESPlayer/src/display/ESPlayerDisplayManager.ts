import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {App} from "vue";
import {playerDisplayManagerKey} from "../injectionSymbols";
import {ESPlayerDisplay} from "./ESPlayerDisplay";

export interface ESPlayerDisplayManager extends ESIPlayerManager {
  getScale(): number

  getSize(size: number): number

  getScreenWidth(): number

  getScreenHeight(): number
}

export function createESPlayerDisplayManager(): ESPlayerDisplayManager {

  let _screenWidth = 1920;
  let _screenHeight = 1080;

  let _scale = 1;

  function init(...params: any[]): Promise<any> {
    const playerDisplay: ESPlayerDisplay = params[0]
    _screenWidth = playerDisplay.screenWidth
    _screenHeight = playerDisplay.screenHeight

    try {
      _scale = _screenWidth / 1920;
    } catch (e) {
    }
    if (_scale <= 0) {
      _scale = 1
    }
    return Promise.resolve();
  }

  function getScale(): number {
    return _scale;
  }

  function getSize(size: number): number {
    return _scale * size;
  }

  function getScreenWidth(): number {
    return _screenWidth;
  }

  function getScreenHeight(): number {
    return _screenHeight;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerDisplayManagerKey, instance)
    },
    init,
    getScale,
    getSize,
    getScreenWidth,
    getScreenHeight
  }
}
