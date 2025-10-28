import {App} from "vue";
import {playerKey} from "../injectionSymbols";
import {createESPlayerDefinitionManager,} from "../definition/ESPlayerDefinitionManager";
import {createESPlayerAspectRatioManager} from "../ratio/ESPlayerAspectRatioManager";
import {createESPlayerRenderManager} from "../render/ESPlayerRenderManager";
import {createESPlayerVolumeManager} from "../volume/ESPlayerVolumeManager";
import {createESPlayerRateManager} from "../rate/ESPlayerRateManager";
import {createESPlayerDecodeManager} from "../decode/ESPlayerDecodeManager";
import {createESPlayerDisplayManager} from "../display/ESPlayerDisplayManager";
import {ESPlayerConfiguration} from "./ESPlayerConfiguration";
import {createESPlayerInterceptorManager} from "../interceptor/ESPlayerInterceptorManager";
import {createESPlayerLog} from "../log/ESPlayerLog";
import {createESPlayerEventManager} from "../event/ESPlayerEventManager";
import {createESPlayerViewManager} from "../view/ESPlayerViewManager";
import {createESPlayerPlayModeManager} from "../mode/ESPlayerPlayModeManager";
import {createESPlayerCacheManager} from "../cache/ESPlayerCacheManager";
import {createESPlayerDeviceManager} from "../device/ESPlayerDeviceManager";
import {createESPlayerLocalStorageManager} from "../storage/ESPlayerLocalStorageManager";
import {createESPlayerTypeManager} from "../type/ESPlayerTypeManager";

export interface ESPlayer {
  install(app: App): void

  init(configuration: ESPlayerConfiguration): Promise<any>

  getPlayerConfiguration(): ESPlayerConfiguration
}

export function createESPlayer(): ESPlayer {
  const playerLog = createESPlayerLog();
  const playerLocalStorageManager = createESPlayerLocalStorageManager()
  const playerDefinitionManager = createESPlayerDefinitionManager()
  const playerAspectRatioManager = createESPlayerAspectRatioManager()
  const playerRenderManager = createESPlayerRenderManager();
  const playerVolumeManager = createESPlayerVolumeManager();
  const playerRateManager = createESPlayerRateManager();
  const playerDecodeManager = createESPlayerDecodeManager()
  const playerDisplayManager = createESPlayerDisplayManager();
  const playerInterceptorManager = createESPlayerInterceptorManager();
  const playerEventManager = createESPlayerEventManager();
  const playerViewManager = createESPlayerViewManager();
  const playerPlayModeManager = createESPlayerPlayModeManager()
  const playerCache = createESPlayerCacheManager();
  const playerDeviceManager = createESPlayerDeviceManager()
  const playerTypeManager = createESPlayerTypeManager()

  let config: ESPlayerConfiguration

  function init(configuration: ESPlayerConfiguration): Promise<any> {
    config = configuration
    return Promise.resolve()
      .then(() => playerLog.init(configuration.debug))
      .then(() => playerDeviceManager.init(configuration.device))
      .then(() => playerLocalStorageManager.init())
      .then(() => playerDefinitionManager.init(playerLocalStorageManager, playerLog))
      .then(() => playerAspectRatioManager.init())
      .then(() => playerRenderManager.init())
      .then(() => playerVolumeManager.init())
      .then(() => playerRateManager.init())
      .then(() => playerDecodeManager.init(playerDeviceManager))
      .then(() => playerTypeManager.init(playerDeviceManager))
      .then(() => playerDisplayManager.init(configuration.display))
      .then(() => playerInterceptorManager.init())
      .then(() => playerEventManager.init())
      .then(() => playerViewManager.init())
      .then(() => playerPlayModeManager.init())
      .then(() => playerCache.init())
  }

  function getPlayerConfiguration() {
    return config
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerKey, instance)
      app.use(playerDefinitionManager)
      app.use(playerAspectRatioManager)
      app.use(playerRenderManager)
      app.use(playerVolumeManager)
      app.use(playerRateManager)
      app.use(playerDecodeManager)
      app.use(playerDisplayManager)
      app.use(playerInterceptorManager)
      app.use(playerEventManager)
      app.use(playerViewManager)
      app.use(playerPlayModeManager)
      app.use(playerLog)
      app.use(playerCache)
      app.use(playerDeviceManager)
      app.use(playerLocalStorageManager)
      app.use(playerTypeManager)
    },
    init,
    getPlayerConfiguration,
  }
}
