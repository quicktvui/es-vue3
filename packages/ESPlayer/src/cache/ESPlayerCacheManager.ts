/**
 * 播放缓存
 */
import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerCacheManagerKey} from "../injectionSymbols";
import {ESPlayerCache} from "./ESPlayerCache";

export interface ESPlayerCacheManager extends ESIPlayerManager {

  setCache(decode: ESPlayerCache): void

  getCache(): ESPlayerCache | null
}

export function createESPlayerCacheManager(): ESPlayerCacheManager {

  let playerCache: ESPlayerCache | null = null

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function setCache(cache: ESPlayerCache): void {
    playerCache = cache;
  }

  function getCache(): ESPlayerCache | null {
    return playerCache
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerCacheManagerKey, instance)
    },
    init,
    setCache,
    getCache
  }
}
