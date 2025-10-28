/**
 *
 */
import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerDefinition,
  ESPlayerError,
  ESPlayerInfo,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType,
  ESPlayerAspectRatio,
  ESPlayerDecode,
  ESPlayerRender,
  ESPlayerControlOptions,
} from "@extscreen/es3-player";
import { ESMediaItemList } from "../core/ESMediaItemList";
import { ESMediaItem } from "../core/ESMediaItem";
import { ESPlayerManagerEventListener } from "./ESPlayerManagerEventListener";
import SparseArray from "../utils/SparseArray";
import { ESIPlayerManager } from "../core/ESIPlayerManager";

export class ESPlayerManagerEventDefaultListener implements ESPlayerManagerEventListener {
  getId(): string {
    return "";
  }

  setEnabled(enabled: boolean): void {}

  isEnabled(): boolean {
    return false;
  }

  setPlayerManager(player: ESIPlayerManager) {}

  getPlayerManager(): ESIPlayerManager | null | undefined {
    return null;
  }

  onPlayerInitialized(playerType: number): void {}

  onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {}

  onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void {}

  onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {}

  onPlayerInterceptSuccess(value: ESPlayerInterceptResult): void {}

  onPlayerInterceptError(value: ESPlayerInterceptError): void {}

  onPlayerSizeChanged(width: number, height: number): void {}

  onPlayerPreparing(): void {}

  onPlayerPrepared(): void {}

  onPlayerBufferStart(): void {}

  onPlayerBufferEnd(): void {}

  onPlayerPlaying(): void {}

  onPlayerProgressChanged(progress: number): void {}

  onPlayerDurationChanged(duration: number): void {}

  onPlayerBufferPercentChanged(percent: number): void {}

  onPlayerSeekStart(): void {}

  onPlayerSeekCompleted(): void {}

  onPlayerPaused(): void {}

  onPlayerResumed(): void {}

  onPlayerStopped(): void {}

  onPlayerCompleted(): void {}

  onPlayerControlled(options: ESPlayerControlOptions): void {}

  onPlayerError(error: ESPlayerError): void {}

  onPlayerInfo(info: ESPlayerInfo): void {}

  onPlayerNoMediaSourceCanPlay(next: boolean): void {}

  onPlayerVolumeChanged(leftVolume: number, rightVolume: number): void {}

  onPlayerLeftVolumeChanged(leftVolume: number): void {}

  onPlayerRightVolumeChanged(rightVolume: number): void {}

  onPlayerDefinitionListChanged(definitionList: Array<ESPlayerDefinition>): void {}

  onPlayerDefinitionChanged(definition: ESPlayerDefinition): void {}

  onPlayerPlayRateListChanged(rateList: Array<ESPlayerRate>): void {}

  onPlayerPlayRateChanged(rate: ESPlayerRate): void {}

  onPlayerDecodeListChanged(decodeList: Array<ESPlayerDecode>): void {}

  onPlayerDecodeChanged(decode: ESPlayerDecode): void {}

  onPlayerAspectRatioListChanged(aspectRatioList: Array<ESPlayerAspectRatio>): void {}

  onPlayerAspectRatioChanged(aspectRatio: ESPlayerAspectRatio): void {}

  onPlayerPlayMediaSourceListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {}

  onPlayerPlayMediaSourceListModeChanged(mode: ESPlayerPlayMode): void {}

  onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void {}

  onPlayerRenderChanged(render: ESPlayerRender): void {}

  onPlayerViewChanged(): void {}

  onPlayerViewSizeChanged(playerWidth: number, playerHeight: number): void {}

  onPlayerClickable(playerClickable: boolean): void {}

  onPlayerReset(): void {}

  onPlayerRelease(): void {}

  onPlayerPlayMediaList(playList: ESMediaItemList): void {}

  onPlayerPlayMedia(mediaItem: ESMediaItem): void {}

  onPlayerNoMediaCanPlay(next: boolean): void {}

  onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {}

  onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void {}

  onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {}

  onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void {}
}
