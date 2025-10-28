import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerVolumeManagerKey} from "../injectionSymbols";
import {ESPlayerVolume} from "./ESPlayerVolume";

export interface ESPlayerVolumeManager extends ESIPlayerManager {

  getLeftVolume(): number

  getRightVolume(): number

  setLeftVolume(leftVolume: number): void

  setRightVolume(rightVolume: number): void
}

export function createESPlayerVolumeManager(): ESPlayerVolumeManager {

  let leftVolume = ESPlayerVolume.ES_PLAYER_MAX_VOLUME
  let rightVolume = ESPlayerVolume.ES_PLAYER_MAX_VOLUME

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function getLeftVolume(): number {
    return leftVolume
  }

  function getRightVolume(): number {
    return rightVolume
  }

  function setLeftVolume(value: number): void {
    leftVolume = value
  }

  function setRightVolume(value: number): void {
    rightVolume = value
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerVolumeManagerKey, instance)
    },
    init,
    getLeftVolume,
    getRightVolume,
    setLeftVolume,
    setRightVolume
  }
}
