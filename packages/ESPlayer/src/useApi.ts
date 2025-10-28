import {inject} from 'vue'

import {
  playerAspectRatioManagerKey,
  playerCacheManagerKey,
  playerDecodeManagerKey,
  playerDefinitionManagerKey,
  playerDeviceManagerKey,
  playerDisplayManagerKey,
  playerEventManagerKey,
  playerInterceptorManagerKey,
  playerKey,
  playerLocalStorageManagerKey,
  playerLogKey,
  playerPlayModeManagerKey,
  playerRateManagerKey,
  playerRenderManagerKey,
  playerTypeManagerKey,
  playerViewManagerKey,
  playerVolumeManagerKey,
} from './injectionSymbols'

import {ESPlayerLog} from "./log/ESPlayerLog";
import {ESPlayer} from "./core/ESPlayer";

import {ESPlayerDefinitionManager} from "./definition/ESPlayerDefinitionManager";
import {ESPlayerAspectRatioManager} from "./ratio/ESPlayerAspectRatioManager";
import {ESPlayerRenderManager} from "./render/ESPlayerRenderManager";
import {ESPlayerVolumeManager} from "./volume/ESPlayerVolumeManager";
import {ESPlayerDecodeManager} from "./decode/ESPlayerDecodeManager";
import {ESPlayerDisplayManager} from "./display/ESPlayerDisplayManager";
import {ESPlayerInterceptorManager} from "./interceptor/ESPlayerInterceptorManager";
import {ESPlayerEventManager} from "./event/ESPlayerEventManager";
import {ESPlayerViewManager} from "./view/ESPlayerViewManager";
import {ESPlayerRateManager} from "./rate/ESPlayerRateManager";
import {ESPlayerPlayModeManager} from "./mode/ESPlayerPlayModeManager";
import {ESPlayerCacheManager} from "./cache/ESPlayerCacheManager";
import {ESPlayerDeviceManager} from "./device/ESPlayerDeviceManager";
import {ESPlayerLocalStorageManager} from "./storage/ESPlayerLocalStorageManager";
import {ESPlayerTypeManager} from "./type/ESPlayerTypeManager";

export function useESPlayer(): ESPlayer {
  return inject(playerKey)!
}

export function useESPlayerDefinitionManager(): ESPlayerDefinitionManager {
  return inject(playerDefinitionManagerKey)!
}

export function useESPlayerAspectRatioManager(): ESPlayerAspectRatioManager {
  return inject(playerAspectRatioManagerKey)!
}

export function useESPlayerRenderManager(): ESPlayerRenderManager {
  return inject(playerRenderManagerKey)!
}

export function useESPlayerVolumeManager(): ESPlayerVolumeManager {
  return inject(playerVolumeManagerKey)!
}

export function useESPlayerDecodeManager(): ESPlayerDecodeManager {
  return inject(playerDecodeManagerKey)!
}

export function useESPlayerDisplayManager(): ESPlayerDisplayManager {
  return inject(playerDisplayManagerKey)!
}

export function useESPlayerRateManager(): ESPlayerRateManager {
  return inject(playerRateManagerKey)!
}

export function useESPlayerInterceptorManager(): ESPlayerInterceptorManager {
  return inject(playerInterceptorManagerKey)!
}

export function useESPlayerEventManager(): ESPlayerEventManager {
  return inject(playerEventManagerKey)!
}

export function useESPlayerPlayModeManager(): ESPlayerPlayModeManager {
  return inject(playerPlayModeManagerKey)!
}

export function useESPlayerViewManager(): ESPlayerViewManager {
  return inject(playerViewManagerKey)!
}

export function useESPlayerLog(): ESPlayerLog {
  return inject(playerLogKey)!
}

export function useESPlayerCacheManager(): ESPlayerCacheManager {
  return inject(playerCacheManagerKey)!
}

export function useESPlayerDeviceManager(): ESPlayerDeviceManager {
  return inject(playerDeviceManagerKey)!
}

export function useESPlayerLocalStorageManager(): ESPlayerLocalStorageManager {
  return inject(playerLocalStorageManagerKey)!
}

export function useESPlayerTypeManager(): ESPlayerTypeManager {
  return inject(playerTypeManagerKey)!
}
