import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerControlOptions,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerError,
  ESPlayerInfo,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerWindowType,
} from "@extscreen/es3-player";
import { ESMediaItemList } from "../core/ESMediaItemList";
import { ESMediaItem } from "../core/ESMediaItem";
import { ESIPlayerManagerView } from "./ESIPlayerManagerView";
import { ESIPlayerManager } from "../core/ESIPlayerManager";
import SparseArray from "../utils/SparseArray";

/**
 * 播放器监听管理者
 */
export interface ESPlayerManagerViewManager {
  addListener<T extends ESIPlayerManagerView>(listener: T): void;

  removeListener<T extends ESIPlayerManagerView>(listener: T): void;

  setEnabled(enabled: boolean): void;

  isEnabled(): boolean;

  setPlayerManager(player: ESIPlayerManager): void;

  getPlayerManager(): ESIPlayerManager;

  onPlayerInitialized(playerType: number): void;

  onPlayerPlayMediaList(playList: ESMediaItemList): void;

  onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void;

  onPlayerPlayMedia(mediaItem: ESMediaItem): void;

  onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void;

  onPlayerPlayMediaSource(mediaSource: ESMediaSource): void;

  onPlayerInterceptSuccess(value: ESPlayerInterceptResult): void;

  onPlayerInterceptError(value: ESPlayerInterceptError): void;

  onPlayerSizeChanged(width: number, height: number): void;

  onPlayerPreparing(): void;

  onPlayerPrepared(): void;

  onPlayerBufferStart(): void;

  onPlayerBufferEnd(): void;

  onPlayerPlaying(): void;

  onPlayerProgressChanged(progress: number): void;

  onPlayerDurationChanged(duration: number): void;

  onPlayerBufferPercentChanged(percent: number): void;

  onPlayerSeekStart(): void;

  onPlayerSeekCompleted(): void;

  onPlayerPaused(): void;

  onPlayerResumed(): void;

  onPlayerStopped(): void;

  onPlayerCompleted(): void;

  onPlayerControlled(options: ESPlayerControlOptions): void;

  onPlayerError(error: ESPlayerError): void;

  onPlayerInfo(info: ESPlayerInfo): void;

  onPlayerNoMediaCanPlay(next: boolean): void;

  onPlayerNoMediaSourceCanPlay(next: boolean): void;

  onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void;

  onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void;

  onPlayerVolumeChanged(leftVolume: number, rightVolume: number): void;

  onPlayerLeftVolumeChanged(leftVolume: number): void;

  onPlayerRightVolumeChanged(rightVolume: number): void;

  onPlayerDefinitionListChanged(definitionList: Array<ESPlayerDefinition>): void;

  onPlayerDefinitionChanged(definition: ESPlayerDefinition): void;

  onPlayerPlayRateListChanged(rateList: Array<ESPlayerRate>): void;

  onPlayerPlayRateChanged(rate: ESPlayerRate): void;

  onPlayerDecodeListChanged(decodeList: Array<ESPlayerDecode>): void;

  onPlayerDecodeChanged(decode: ESPlayerDecode): void;

  onPlayerAspectRatioListChanged(aspectRatioList: Array<ESPlayerAspectRatio>): void;

  onPlayerAspectRatioChanged(aspectRatio: ESPlayerAspectRatio): void;

  onPlayerPlayMediaSourceListModeListChanged(modeList: Array<ESPlayerPlayMode>): void;

  onPlayerPlayMediaSourceListModeChanged(mode: ESPlayerPlayMode): void;

  onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void;

  onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void;

  onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void;

  onPlayerRenderChanged(render: ESPlayerRender): void;

  onPlayerViewChanged(): void;

  onPlayerViewSizeChanged(playerWidth: number, playerHeight: number): void;

  onPlayerViewClickable(playerClickable: boolean): void;

  onPlayerRelease(): void;

  onPlayerReset(): void;
}

export function createESPlayerManagerViewManager(): ESPlayerManagerViewManager {
  let _enabled = true;
  let _listenerList: Array<ESIPlayerManagerView> = [];
  let _player: ESIPlayerManager;

  function addListener<T extends ESIPlayerManagerView>(listener: T): void {
    // 去重
    if (_listenerList.some((l) => l.getId() === listener.getId())) {
      return;
    }
    _listenerList.push(listener);

    // 如果已有 player，则立即注入
    try {
      if (_player && typeof listener.setPlayerManager === "function") {
        listener.setPlayerManager(_player);
      }
    } catch (e) {}
  }

  function removeListener<T extends ESIPlayerManagerView>(listener: T): void {
    const index = _listenerList.findIndex((l) => l.getId() === listener.getId());
    if (index !== -1) {
      _listenerList.splice(index, 1);
    }
  }

  function setPlayerManager(player: ESIPlayerManager): void {
    _player = player;
    // 遍历已有 listener，注入 player
    for (const listener of _listenerList) {
      try {
        if (typeof listener.setPlayerManager === "function") {
          listener.setPlayerManager(_player);
        }
      } catch (e) {}
    }
  }

  function getPlayerManager(): ESIPlayerManager {
    return _player;
  }

  function setEnabled(enabled: boolean): void {
    _enabled = enabled;
  }

  function isEnabled(): boolean {
    return _enabled;
  }

  function onPlayerInitialized(playerType: number): void {
    playerEventMethodEval("onPlayerInitialized", playerType);
  }

  function onPlayerPlayMediaList(playList: ESMediaItemList): void {
    playerEventMethodEval("onPlayerPlayMediaList", playList);
  }

  function onPlayerPlayMedia(mediaItem: ESMediaItem): void {
    playerEventMethodEval("onPlayerPlayMedia", mediaItem);
  }

  function onPlayerInterceptSuccess(interceptResult: ESPlayerInterceptResult): void {
    playerEventMethodEval("onPlayerInterceptSuccess", interceptResult);
  }

  function onPlayerInterceptError(interceptError: ESPlayerInterceptError): void {
    playerEventMethodEval("onPlayerInterceptError", interceptError);
  }

  function onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void {
    playerEventMethodEval("onPlayerMediaListInitialized", mediaItemList);
  }

  function onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {
    playerEventMethodEval("onPlayerPlayMediaSourceList", mediaSourceList);
  }

  function onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {
    playerEventMethodEval("onPlayerPlayMediaSource", mediaSource);
  }

  function onPlayerSizeChanged(width: number, height: number): void {
    playerEventMethodEval("onPlayerSizeChanged", width, height);
  }

  function onPlayerPreparing(): void {
    playerEventMethodEval("onPlayerPreparing");
  }

  function onPlayerPrepared(): void {
    playerEventMethodEval("onPlayerPrepared");
  }

  function onPlayerBufferStart(): void {
    playerEventMethodEval("onPlayerBufferStart");
  }

  function onPlayerBufferEnd(): void {
    playerEventMethodEval("onPlayerBufferEnd");
  }

  function onPlayerPlaying(): void {
    playerEventMethodEval("onPlayerPlaying");
  }

  function onPlayerProgressChanged(progress: number): void {
    playerEventMethodEval("onPlayerProgressChanged", progress);
  }

  function onPlayerDurationChanged(duration: number): void {
    playerEventMethodEval("onPlayerDurationChanged", duration);
  }

  function onPlayerBufferPercentChanged(percent: number): void {
    playerEventMethodEval("onPlayerBufferPercentChanged", percent);
  }

  function onPlayerSeekStart(): void {
    playerEventMethodEval("onPlayerSeekStart");
  }

  function onPlayerSeekCompleted(): void {
    playerEventMethodEval("onPlayerSeekCompleted");
  }

  function onPlayerPaused(): void {
    playerEventMethodEval("onPlayerPaused");
  }

  function onPlayerResumed(): void {
    playerEventMethodEval("onPlayerResumed");
  }

  function onPlayerStopped(): void {
    playerEventMethodEval("onPlayerStopped");
  }

  function onPlayerCompleted(): void {
    playerEventMethodEval("onPlayerCompleted");
  }

  function onPlayerControlled(options: ESPlayerControlOptions): void {
    playerEventMethodEval("onPlayerControlled", options);
  }

  function onPlayerError(error: ESPlayerError): void {
    playerEventMethodEval("onPlayerError", error);
  }

  function onPlayerInfo(info: ESPlayerInfo): void {
    playerEventMethodEval("onPlayerInfo", info);
  }

  function onPlayerNoMediaCanPlay(next: boolean): void {
    playerEventMethodEval("onPlayerNoMediaCanPlay", next);
  }

  function onPlayerNoMediaSourceCanPlay(next: boolean): void {
    playerEventMethodEval("onPlayerNoMediaSourceCanPlay", next);
  }

  function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
    playerEventMethodEval("onPlayerWindowTypeChanged", windowType);
  }

  function onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void {
    playerEventMethodEval("onPlayerWindowSizeChanged", playerWidth, playerHeight);
  }

  function onPlayerVolumeChanged(leftVolume: number, rightVolume: number): void {
    playerEventMethodEval("onPlayerVolumeChanged", leftVolume, rightVolume);
  }

  function onPlayerLeftVolumeChanged(leftVolume: number): void {
    playerEventMethodEval("onPlayerLeftVolumeChanged", leftVolume);
  }

  function onPlayerRightVolumeChanged(rightVolume: number): void {
    playerEventMethodEval("onPlayerRightVolumeChanged", rightVolume);
  }

  function onPlayerDefinitionListChanged(definitionList: Array<ESPlayerDefinition>): void {
    playerEventMethodEval("onPlayerDefinitionListChanged", definitionList);
  }

  function onPlayerDefinitionChanged(definition: ESPlayerDefinition): void {
    playerEventMethodEval("onPlayerDefinitionChanged", definition);
  }

  function onPlayerPlayRateListChanged(rateList: Array<ESPlayerRate>): void {
    playerEventMethodEval("onPlayerPlayRateListChanged", rateList);
  }

  function onPlayerPlayRateChanged(rate: ESPlayerRate): void {
    playerEventMethodEval("onPlayerPlayRateChanged", rate);
  }

  function onPlayerDecodeListChanged(decodeList: Array<ESPlayerDecode>): void {
    playerEventMethodEval("onPlayerDecodeListChanged", decodeList);
  }

  function onPlayerDecodeChanged(decode: ESPlayerDecode): void {
    playerEventMethodEval("onPlayerDecodeChanged", decode);
  }

  function onPlayerAspectRatioListChanged(aspectRatioList: Array<ESPlayerAspectRatio>): void {
    playerEventMethodEval("onPlayerAspectRatioListChanged", aspectRatioList);
  }

  function onPlayerAspectRatioChanged(aspectRatio: ESPlayerAspectRatio): void {
    playerEventMethodEval("onPlayerAspectRatioChanged", aspectRatio);
  }

  function onPlayerPlayMediaSourceListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {
    playerEventMethodEval("onPlayerPlayMediaSourceListModeListChanged", modeList);
  }

  function onPlayerPlayMediaSourceListModeChanged(mode: ESPlayerPlayMode): void {
    playerEventMethodEval("onPlayerPlayMediaSourceListModeChanged", mode);
  }

  function onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {
    playerEventMethodEval("onPlayerPlayMediaListModeListChanged", modeList);
  }

  function onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void {
    playerEventMethodEval("onPlayerPlayMediaListModeChanged", mode);
  }

  function onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void {
    playerEventMethodEval("onPlayerRenderListChanged", renderList);
  }

  function onPlayerRenderChanged(render: ESPlayerRender): void {
    playerEventMethodEval("onPlayerRenderChanged", render);
  }

  function onPlayerViewChanged(): void {
    playerEventMethodEval("onPlayerViewChanged");
  }

  function onPlayerViewSizeChanged(playerWidth: number, playerHeight: number): void {
    playerEventMethodEval("onPlayerViewSizeChanged", playerWidth, playerHeight);
  }

  function onPlayerViewClickable(playerClickable: boolean): void {
    playerEventMethodEval("onPlayerViewClickable", playerClickable);
  }

  function onPlayerReset(): void {
    playerEventMethodEval("onPlayerReset");
  }

  function onPlayerRelease(): void {
    playerEventMethodEval("onPlayerRelease");
  }

  function playerEventMethodEval(method, ...params) {
    if (_listenerList.length > 0) {
      _listenerList.map((listener) => {
        if (listener) {
          try {
            listener[method](...params);
          } catch (e) {}
        }
      });
    }
  }

  return {
    addListener,
    removeListener,
    setPlayerManager,
    getPlayerManager,
    setEnabled,
    isEnabled,
    onPlayerInitialized,
    onPlayerPlayMediaList,
    onPlayerPlayMedia,
    onPlayerInterceptSuccess,
    onPlayerInterceptError,
    onPlayerMediaListInitialized,
    onPlayerPlayMediaSourceList,
    onPlayerPlayMediaSource,
    onPlayerSizeChanged,
    onPlayerPreparing,
    onPlayerPrepared,
    onPlayerBufferStart,
    onPlayerBufferEnd,
    onPlayerPlaying,
    onPlayerProgressChanged,
    onPlayerDurationChanged,
    onPlayerBufferPercentChanged,
    onPlayerSeekStart,
    onPlayerSeekCompleted,
    onPlayerPaused,
    onPlayerResumed,
    onPlayerStopped,
    onPlayerCompleted,
    onPlayerControlled,
    onPlayerError,
    onPlayerInfo,
    onPlayerNoMediaCanPlay,
    onPlayerNoMediaSourceCanPlay,
    onPlayerWindowTypeChanged,
    onPlayerWindowSizeChanged,
    onPlayerVolumeChanged,
    onPlayerLeftVolumeChanged,
    onPlayerRightVolumeChanged,
    onPlayerDefinitionListChanged,
    onPlayerDefinitionChanged,
    onPlayerPlayRateListChanged,
    onPlayerPlayRateChanged,
    onPlayerDecodeListChanged,
    onPlayerDecodeChanged,
    onPlayerAspectRatioListChanged,
    onPlayerAspectRatioChanged,
    onPlayerPlayMediaSourceListModeListChanged,
    onPlayerPlayMediaSourceListModeChanged,
    onPlayerPlayMediaListModeListChanged,
    onPlayerPlayMediaListModeChanged,
    onPlayerRenderListChanged,
    onPlayerRenderChanged,
    onPlayerViewChanged,
    onPlayerViewSizeChanged,
    onPlayerViewClickable,
    onPlayerReset,
    onPlayerRelease,
  };
}
