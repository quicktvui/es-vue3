/**
 *
 */
import {
  ESPlayerPlayMode,
  ESPlayerWindowType,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerError,
  ESPlayerInfo,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerControlOptions,
} from "@extscreen/es3-player";
import { ESMediaItemList } from "../core/ESMediaItemList";
import { ESIPlayerManager } from "../core/ESIPlayerManager";
import { ESMediaItem } from "../core/ESMediaItem";
import { ESKeyEvent } from "@extscreen/es3-core";
import { ESIPlayerManagerView } from "./ESIPlayerManagerView";
import SparseArray from "../utils/SparseArray";

export class ESIPlayerManagerDefaultView implements ESIPlayerManagerView {
  getId(): string {
    return "";
  }

  setVisible(value: boolean): void {}

  setEnabled(enabled: boolean): void {}

  isEnabled(): boolean {
    return false;
  }

  onPlayerInitialized(playerType: number): void {}

  onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {}

  onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void {}

  onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {}

  onPlayerInterceptSuccess(value: ESPlayerInterceptResult): void {}

  onPlayerInterceptError(value: ESPlayerInterceptError): void {}

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

  onPlayerSizeChanged(playerWidth: number, playerHeight: number): void {}

  onPlayerClickable(playerClickable: boolean): void {}

  onPlayerRelease(): void {}

  onPlayerReset(): void {}

  setPlayerManager(player: ESIPlayerManager): void {}

  getPlayerManager(): ESIPlayerManager | null | undefined {
    return null;
  }

  onPlayerPlayMediaList(playList: ESMediaItemList): void {}

  onPlayerPlayMedia(mediaItem: ESMediaItem): void {}

  onPlayerNoMediaCanPlay(next: boolean): void {}

  onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {}

  onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void {}

  onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {}

  onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void {}

  onKeyDown(keyEvent: ESKeyEvent): boolean {
    return false;
  }

  onKeyUp(keyEvent: ESKeyEvent): boolean {
    return false;
  }

  onBackPressed(): boolean {
    return false;
  }
}
