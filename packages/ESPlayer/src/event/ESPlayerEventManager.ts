import { ESPlayerEventListener } from "./ESPlayerEventListener";
import { ESMediaSourceList } from "../core/ESMediaSourceList";
import { ESMediaSource } from "../core/ESMediaSource";
import { ESPlayerInterceptResult } from "../interceptor/ESPlayerInterceptResult";
import { ESPlayerInterceptError } from "../interceptor/ESPlayerInterceptError";
import { ESPlayerDefinition } from "../definition/ESPlayerDefinition";
import { ESPlayerRate } from "../rate/ESPlayerRate";
import { ESPlayerDecode } from "../decode/ESPlayerDecode";
import { ESPlayerAspectRatio } from "../ratio/ESPlayerAspectRatio";
import { ESPlayerPlayMode } from "../mode/ESPlayerPlayMode";
import { ESPlayerError } from "../error/ESPlayerError";
import { ESPlayerInfo } from "../info/ESPlayerInfo";
import { ESIPlayer } from "../core/ESIPlayer";
import { ESIPlayerManager } from "../core/ESIPlayerManager";
import { App } from "vue";
import { playerEventManagerKey } from "../injectionSymbols";
import { ESPlayerRender } from "../render/ESPlayerRender";
import { ESPlayerControlOptions } from "../core/ESPlayerControlOptions";

/**
 * 播放器监听管理者
 */
export interface ESPlayerEventManager extends ESIPlayerManager {
  addListener<T extends ESPlayerEventListener>(listener: T): void;

  removeListener<T extends ESPlayerEventListener>(listener: T): void;

  setEnabled(enabled: boolean): void;

  isEnabled(): boolean;

  setPlayer(player: ESIPlayer): void;

  getPlayer(): ESIPlayer;

  onPlayerInitialized(playerType: number): void;

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

  onPlayerNoMediaSourceCanPlay(next: boolean): void;

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

  onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void;

  onPlayerRenderChanged(render: ESPlayerRender): void;

  onPlayerViewChanged(): void;

  onPlayerClickable(playerClickable: boolean): void;

  onPlayerRelease(): void;

  onPlayerReset(): void;
}

export function createESPlayerEventManager(): ESPlayerEventManager {
  let _enabled = true;
  let _listenerList: Array<ESPlayerEventListener> = [];
  let _player: ESIPlayer;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function addListener<T extends ESPlayerEventListener>(listener: T): void {
    // 去重
    if (_listenerList.some((l) => l.getId() === listener.getId())) {
      return;
    }
    _listenerList.push(listener);

    // 如果已有 player，则立即注入
    try {
      if (_player && typeof listener.setPlayer === "function") {
        listener.setPlayer(_player);
      }
    } catch (e) {}
  }

  function removeListener<T extends ESPlayerEventListener>(listener: T): void {
    const index = _listenerList.findIndex((l) => l.getId() === listener.getId());
    if (index !== -1) {
      _listenerList.splice(index, 1);
    }
  }

  function setPlayer(player: ESIPlayer): void {
    _player = player;
    // 遍历已有 listener，注入 player
    for (const listener of _listenerList) {
      try {
        if (typeof listener.setPlayer === "function") {
          listener.setPlayer(_player);
        }
      } catch (e) {}
    }
  }

  function getPlayer(): ESIPlayer {
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

  function onPlayerInterceptSuccess(interceptResult: ESPlayerInterceptResult): void {
    playerEventMethodEval("onPlayerInterceptSuccess", interceptResult);
  }

  function onPlayerInterceptError(interceptError: ESPlayerInterceptError): void {
    playerEventMethodEval("onPlayerInterceptError", interceptError);
  }

  function onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {
    playerEventMethodEval("onPlayerPlayMediaSourceList", mediaSourceList);
  }

  function onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {
    playerEventMethodEval("onPlayerPlayMediaSource", mediaSource);
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

  function onPlayerNoMediaSourceCanPlay(next: boolean): void {
    playerEventMethodEval("onPlayerNoMediaSourceCanPlay", next);
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

  function onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void {
    playerEventMethodEval("onPlayerRenderListChanged", renderList);
  }

  function onPlayerRenderChanged(render: ESPlayerRender): void {
    playerEventMethodEval("onPlayerRenderChanged", render);
  }

  function onPlayerViewChanged(): void {
    playerEventMethodEval("onPlayerViewChanged");
  }

  function onPlayerSizeChanged(playerWidth: number, playerHeight: number): void {
    playerEventMethodEval("onPlayerSizeChanged", playerWidth, playerHeight);
  }

  function onPlayerClickable(playerClickable: boolean): void {
    playerEventMethodEval("onPlayerClickable", playerClickable);
  }

  function onPlayerRelease(): void {
    playerEventMethodEval("onPlayerRelease");
  }

  function onPlayerReset(): void {
    playerEventMethodEval("onPlayerReset");
  }

  function playerEventMethodEval(method, ...params) {
    try {
      if (_listenerList.length > 0) {
        _listenerList.map((listener) => {
          try {
            if (listener) {
              listener[method](...params);
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(playerEventManagerKey, instance);
    },
    init,
    addListener,
    removeListener,
    setEnabled,
    isEnabled,
    setPlayer,
    getPlayer,
    onPlayerInitialized,
    onPlayerPlayMediaSourceList,
    onPlayerPlayMediaSource,
    onPlayerInterceptSuccess,
    onPlayerInterceptError,
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
    onPlayerNoMediaSourceCanPlay,
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
    onPlayerRenderListChanged,
    onPlayerRenderChanged,
    onPlayerViewChanged,
    onPlayerClickable,
    onPlayerRelease,
    onPlayerReset,
  };
}
