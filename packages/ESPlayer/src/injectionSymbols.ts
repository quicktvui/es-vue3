import type {InjectionKey} from 'vue'
import {ESPlayerDefinitionManager} from "./definition/ESPlayerDefinitionManager";
import {ESPlayerAspectRatioManager} from "./ratio/ESPlayerAspectRatioManager";
import {ESPlayerRenderManager} from "./render/ESPlayerRenderManager";
import {ESPlayer} from "./core/ESPlayer";
import {ESPlayerVolumeManager} from "./volume/ESPlayerVolumeManager";
import {ESPlayerRateManager} from "./rate/ESPlayerRateManager";
import {ESPlayerDecodeManager} from "./decode/ESPlayerDecodeManager";
import {ESPlayerDisplayManager} from "./display/ESPlayerDisplayManager";
import {ESPlayerInterceptorManager} from "./interceptor/ESPlayerInterceptorManager";
import {ESPlayerLog} from "./log/ESPlayerLog";
import {ESPlayerEventManager} from "./event/ESPlayerEventManager";
import {ESPlayerViewManager} from "./view/ESPlayerViewManager";
import {ESPlayerPlayModeManager} from "./mode/ESPlayerPlayModeManager";
import {ESPlayerCacheManager} from "./cache/ESPlayerCacheManager";
import {ESPlayerDeviceManager} from "./device/ESPlayerDeviceManager";
import {ESPlayerLocalStorageManager} from "./storage/ESPlayerLocalStorageManager";
import {ESPlayerTypeManager} from "./type/ESPlayerTypeManager";

export const playerKey = Symbol(
  'PlayerManagerKey'
) as InjectionKey<ESPlayer>

export const playerDefinitionManagerKey = Symbol(
  'PlayerDefinitionManagerKey'
) as InjectionKey<ESPlayerDefinitionManager>

export const playerAspectRatioManagerKey = Symbol(
  'PlayerAspectRatioManagerKey'
) as InjectionKey<ESPlayerAspectRatioManager>

export const playerPlayModeManagerKey = Symbol(
  'playerPlayModeManagerKey'
) as InjectionKey<ESPlayerPlayModeManager>

export const playerRenderManagerKey = Symbol(
  'PlayerRenderManagerKey'
) as InjectionKey<ESPlayerRenderManager>

export const playerVolumeManagerKey = Symbol(
  'PlayerVolumeManagerKey'
) as InjectionKey<ESPlayerVolumeManager>

export const playerRateManagerKey = Symbol(
  'PlayerRateManagerKey'
) as InjectionKey<ESPlayerRateManager>

export const playerDecodeManagerKey = Symbol(
  'PlayerDecodeManagerKey'
) as InjectionKey<ESPlayerDecodeManager>

export const playerDisplayManagerKey = Symbol(
  'PlayerDisplayManagerKey'
) as InjectionKey<ESPlayerDisplayManager>

export const playerInterceptorManagerKey = Symbol(
  'ESPlayerInterceptorManagerKey'
) as InjectionKey<ESPlayerInterceptorManager>

export const playerEventManagerKey = Symbol(
  'ESPlayerEventManagerKey'
) as InjectionKey<ESPlayerEventManager>

export const playerViewManagerKey = Symbol(
  'ESPlayerViewManagerKey'
) as InjectionKey<ESPlayerViewManager>

export const playerLogKey = Symbol(
  'ESPlayerLogKey'
) as InjectionKey<ESPlayerLog>

export const playerCacheManagerKey = Symbol(
  'ESPlayerCacheManagerKey'
) as InjectionKey<ESPlayerCacheManager>

export const playerDeviceManagerKey = Symbol(
  'ESPlayerDeviceManagerKey'
) as InjectionKey<ESPlayerDeviceManager>

export const playerLocalStorageManagerKey = Symbol(
  'PlayerLocalStorageManager'
) as InjectionKey<ESPlayerLocalStorageManager>

export const playerTypeManagerKey = Symbol(
  'PlayerTypeManagerKey'
) as InjectionKey<ESPlayerTypeManager>
