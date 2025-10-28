import { ESIPlayer } from "../core/ESIPlayer.js";
import { ESMediaSourceList } from "../core/ESMediaSourceList";
import { ESMediaSource } from "../core/ESMediaSource";
import { ESPlayerDefinition } from "../definition/ESPlayerDefinition";
import { ESPlayerRate } from "../rate/ESPlayerRate";
import { ESPlayerDecode } from "../decode/ESPlayerDecode";
import { ESPlayerAspectRatio } from "../ratio/ESPlayerAspectRatio";
import { ESPlayerError } from "../error/ESPlayerError";
import { ESPlayerInfo } from "../info/ESPlayerInfo";
import { ESPlayerInterceptResult } from "../interceptor/ESPlayerInterceptResult";
import { ESPlayerInterceptError } from "../interceptor/ESPlayerInterceptError";
import { ESPlayerRender } from "../render/ESPlayerRender";
import { ESIPlayerView } from "./ESIPlayerView";
import { ESPlayerPlayMode } from "../mode/ESPlayerPlayMode";
import { ESPlayerControlOptions } from "../core/ESPlayerControlOptions";

export class ESPlayerDefaultView implements ESIPlayerView {
  getId(): string {
    return "";
  }

  setVisible(value: boolean): void {}

  setEnabled(enabled: boolean): void {}

  isEnabled(): boolean {
    return false;
  }

  setPlayer(player: ESIPlayer): void {}

  getPlayer(): ESIPlayer | null | undefined {
    return null;
  }

  onPlayerInitialized(playerType: number): void {}

  onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {}

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
}
