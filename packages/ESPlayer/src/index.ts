import { ESPlayerState } from "./core/ESPlayerState";
import { ESPlayerDecode } from "./decode/ESPlayerDecode";
import { ESPlayerDefinition } from "./definition/ESPlayerDefinition";
import { ESPlayerRate } from "./rate/ESPlayerRate";
import { ESPlayerAspectRatio } from "./ratio/ESPlayerAspectRatio";
import { ESPlayerWindowType } from "./window/ESPlayerWindowType";
import { ESPlayerRender } from "./render/ESPlayerRender";
import { ESPlayerErrors } from "./error/ESPlayerErrors";
import { ESPlayerVolume } from "./volume/ESPlayerVolume";
import { ESPlayerPlayMode } from "./mode/ESPlayerPlayMode";
import { ESPlayerDefinitionStrategy } from "./definition/ESPlayerDefinitionStrategy";
import { ESPlayerInterceptorType } from "./interceptor/ESPlayerInterceptorType";
import { ESPlayerDefinitionManager } from "./definition/ESPlayerDefinitionManager";
import { ESPlayerAspectRatioManager } from "./ratio/ESPlayerAspectRatioManager";
import { ESPlayerRenderManager } from "./render/ESPlayerRenderManager";
import { ESPlayerType } from "./type/ESPlayerType";
import { ESPlayerLogLevel } from "./log/ESPlayerLog";
import { createESPlayer } from "./core/ESPlayer";

import {
  useESPlayer,
  useESPlayerAspectRatioManager,
  useESPlayerCacheManager,
  useESPlayerDecodeManager,
  useESPlayerDefinitionManager,
  useESPlayerDeviceManager,
  useESPlayerDisplayManager,
  useESPlayerEventManager,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerPlayModeManager,
  useESPlayerRateManager,
  useESPlayerRenderManager,
  useESPlayerViewManager,
  useESPlayerVolumeManager,
  useESPlayerLocalStorageManager,
  useESPlayerTypeManager,
} from "./useApi";

export {
  ESPlayerState,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerDefinitionStrategy,
  ESPlayerRate,
  ESPlayerAspectRatio,
  ESPlayerWindowType,
  ESPlayerRender,
  ESPlayerErrors,
  ESPlayerVolume,
  ESPlayerPlayMode,
  ESPlayerInterceptorType,
  ESPlayerType,
  ESPlayerLogLevel,
};

export {
  createESPlayer,
  useESPlayerDefinitionManager,
  useESPlayerAspectRatioManager,
  useESPlayerRenderManager,
  useESPlayerVolumeManager,
  useESPlayerDecodeManager,
  useESPlayerDisplayManager,
  useESPlayer,
  useESPlayerInterceptorManager,
  useESPlayerEventManager,
  useESPlayerViewManager,
  useESPlayerRateManager,
  useESPlayerPlayModeManager,
  useESPlayerLog,
  useESPlayerCacheManager,
  useESPlayerDeviceManager,
  useESPlayerLocalStorageManager,
  useESPlayerTypeManager,
};

//
export type { ESPlayerAspectRatioManager } from "./ratio/ESPlayerAspectRatioManager";
export type { ESPlayerCacheManager } from "./cache/ESPlayerCacheManager";
export type { ESPlayerDecodeManager } from "./decode/ESPlayerDecodeManager";
export type { ESPlayerDefinitionManager } from "./definition/ESPlayerDefinitionManager";
export type { ESPlayerDeviceManager } from "./device/ESPlayerDeviceManager";
export type { ESPlayerDisplayManager } from "./display/ESPlayerDisplayManager";
export type { ESPlayerEventManager } from "./event/ESPlayerEventManager";
export type { ESPlayerInterceptorManager } from "./interceptor/ESPlayerInterceptorManager";
export type { ESPlayerLocalStorageManager } from "./storage/ESPlayerLocalStorageManager";
export type { ESPlayerLog } from "./log/ESPlayerLog";
export type { ESPlayerPlayModeManager } from "./mode/ESPlayerPlayModeManager";
export type { ESPlayerRateManager } from "./rate/ESPlayerRateManager";
export type { ESPlayerRenderManager } from "./render/ESPlayerRenderManager";
export type { ESPlayerTypeManager } from "./type/ESPlayerTypeManager";
export type { ESPlayerViewManager } from "./view/ESPlayerViewManager";
export type { ESPlayerVolumeManager } from "./volume/ESPlayerVolumeManager";

//
export type { ESPlayerDisplay } from "./display/ESPlayerDisplay";
export type { ESPlayer } from "./core/ESPlayer";
export type { ESIPlayer } from "./core/ESIPlayer";
export type { ESMediaSource } from "./core/ESMediaSource";
export type { ESMediaSourceList } from "./core/ESMediaSourceList";
export type { ESPlayerError } from "./error/ESPlayerError";
export type { ESPlayerCommand } from "./core/ESPlayerCommand";
export type { ESPlayerControlOptions } from "./core/ESPlayerControlOptions";

//
export type { ESPlayerEventListener } from "./event/ESPlayerEventListener";
export { ESPlayerEventDefaultListener } from "./event/ESPlayerEventDefaultListener";
//
export type { ESPlayerInfo } from "./info/ESPlayerInfo";
export { ESPlayerInfoCode } from "./info/ESPlayerInfo";

export type { ESPlayerConfiguration } from "./core/ESPlayerConfiguration";
export type { ESIPlayerInterceptor } from "./interceptor/ESIPlayerInterceptor";
export type { ESPlayerInterceptResult } from "./interceptor/ESPlayerInterceptResult";
export type { ESPlayerInterceptError } from "./interceptor/ESPlayerInterceptError";
//
export type { ESIPlayerView } from "./view/ESIPlayerView";
export type { ESPlayerDefaultView } from "./view/ESPlayerDefaultView";
//
export type { ESMediaMetadata } from "./core/ESMediaMetadata";
export type { ESPlayerComponentInfo } from "./core/ESPlayerComponentInfo";
export type { ESPlayerStatus } from "./core/ESPlayerStatus";

//
export type { ESPlayerPosition } from "./core/ESPlayerPosition";
//
export type { ESPlayerProgressCallback } from "./core/ESPlayerProgressCallback";
export type { ESPlayerDurationCallback } from "./core/ESPlayerDurationCallback";
export type { ESPlayerBufferPercentCallback } from "./core/ESPlayerBufferPercentCallback";

//ESPlayerOption
export type { ESPlayerOption } from "./option/ESPlayerOption";
export { ESPlayerOptionType, ESPlayerOptionCategory } from "./option/ESPlayerOptionType";

//ESPlayerCache
export type { ESPlayerCache } from "./cache/ESPlayerCache";

//ESPlayerDevice
export { ESPlayerDeviceType } from "./device/ESPlayerDeviceType";
export type { ESPlayerDevice } from "./device/ESPlayerDevice";

//M3U8Definition
export { TrackType, SubType, HLS_ADAPTIVE_NUMBER } from "./core/M3U8DefinitionInfo";
export type { M3U8DefinitionInfo, StreamInfo } from "./core/M3U8DefinitionInfo";

//ESPlayerTrackInfo
export type { ESPlayerTrackInfo } from "./core/ESPlayerTrackInfo";
//ESPlayerCDNInfo
export type { ESPlayerCDNInfo } from "./core/ESPlayerCDNInfo";
//ESPlayerMediaMeta
export type {
  ESPlayerMediaMeta,
  ESPlayerVideoStream,
  ESPlayerAudioStream,
  ESPlayerTimedTextStream,
} from "./core/ESPlayerMediaMeta";
//ESPlayerTrackType
export { ESPlayerTrackType } from "./core/ESPlayerTrackType";
