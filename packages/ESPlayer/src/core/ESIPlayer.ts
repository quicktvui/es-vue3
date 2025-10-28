import { ESMediaSourceList } from "./ESMediaSourceList";
import { ESMediaSource } from "./ESMediaSource";
import { ESPlayerRate } from "../rate/ESPlayerRate";
import { ESPlayerDefinition } from "../definition/ESPlayerDefinition";
import { ESPlayerDecode } from "../decode/ESPlayerDecode";
import { ESPlayerAspectRatio } from "../ratio/ESPlayerAspectRatio";
import { ESPlayerProgressCallback } from "./ESPlayerProgressCallback";
import { ESPlayerDurationCallback } from "./ESPlayerDurationCallback";
import { ESPlayerPlayMode } from "../mode/ESPlayerPlayMode";
import { ESPlayerRender } from "../render/ESPlayerRender";
import { ESPlayerCache } from "../cache/ESPlayerCache";
import { M3U8DefinitionInfo } from "./M3U8DefinitionInfo";
import { ESPlayerControlOptions } from "./ESPlayerControlOptions";
import { ESPlayerMediaMeta } from "./ESPlayerMediaMeta";
import { ESPlayerCDNInfo } from "./ESPlayerCDNInfo";
import { ESPlayerTrackInfo } from "./ESPlayerTrackInfo";
import { ESPlayerBufferPercentCallback } from "./ESPlayerBufferPercentCallback";
import { ESPlayerTrackType } from "./ESPlayerTrackType";

export interface ESIPlayer {
  getComponentInfo(): void;

  initComponent(...params: Array<any>): void;

  getId(): string;

  getType(): number;

  setVisible(value: boolean): void;

  /**
   * 初始化播放器：--->安装插件--->懒加载--->播放组件初始化
   * initializePlayer --->initializePluginPlayer --->initializeLazyPlayer --->initializePlayerComponent
   *                      onPlayerPluginInitSuccess   onPlayerLazyInitSuccess  onPlayerInitializeSuccess
   *                      onPlayerPluginInitError     onPlayerLazyInitError    onPlayerInitializeError
   */
  initialize(): void;

  isInitialized(): boolean;

  playMediaSourceList(mediaSourceList: ESMediaSourceList): void;

  playMediaSourceByIndex(index: number): void;

  playMediaSourceById(id: string): void;

  playMediaSource(mediaSource: ESMediaSource): void;

  playNextMediaSource(): void;

  playPreviousMediaSource(): void;

  getMediaSourceList(): Array<ESMediaSource> | null;

  getMediaSource(index: number): ESMediaSource | null;

  getPlayingMediaSourceIndex(): number;

  getPlayingMediaSourceList(): ESMediaSourceList | null;

  getPlayingMediaSource(): ESMediaSource | null;

  play(...params: Array<any>): void;

  start(position: number): void;

  pause(): void;

  resume(): void;

  stop(): void;

  reset(): void;

  release(): void;

  seekTo(progress: number): void;

  control(options: ESPlayerControlOptions): void;

  getDuration(): void;

  getCurrentPosition(): void;

  setSize(width: number, height: number): void;

  setPlayerDimension(
    defaultWidth: number,
    defaultHeight: number,
    fullPlayerWidth: number,
    fullPlayerHeight: number,
    fullScreen: boolean,
    quickUpdate: boolean,
  ): void;

  setPlayRate(playRate: ESPlayerRate): void;

  setPlayMode(playMode: ESPlayerPlayMode): void;

  setDefinition(definition: ESPlayerDefinition): void;

  setCache(cache: ESPlayerCache): void;

  setDecode(decode: ESPlayerDecode): void;

  setRender(render: ESPlayerRender): void;

  setAspectRatio(aspectRatio: ESPlayerAspectRatio): void;

  getLeftVolume(): void;

  getRightVolume(): void;

  setLeftVolume(leftVolume: number): void;

  setRightVolume(rightVolume: number): void;

  setVolume(volume: number): void;

  getVolume(): void;

  setStopped(stopped: boolean): void;

  setEnabled(enabled: boolean): void;

  setProgressCallback(callback: ESPlayerProgressCallback): void;

  setDurationCallback(callback: ESPlayerDurationCallback): void;

  setBufferPercentCallback(callback: ESPlayerBufferPercentCallback): void;

  invalidate(): void;

  getM3U8DefinitionInfo(): Promise<Array<M3U8DefinitionInfo>>;

  setM3U8Definition(id: number): void;

  setM3U8DefaultDefinition(id: number): void;

  getTrackInfo(sysType?: number): Promise<Array<ESPlayerTrackInfo>>;

  getSelectTrack(trackType: ESPlayerTrackType): Promise<number>;

  selectTrack(index: number): void;

  deselectTrack(index: number): void;

  getTcpSpeed(): Promise<string>;

  getBitRate(): Promise<string>;

  getTcpSpeed2(): Promise<string>;

  getBitRate2(): Promise<string>;

  getMediaMeta(): Promise<ESPlayerMediaMeta>;

  getCdnInfo(): Promise<ESPlayerCDNInfo>;

  getVideoDecoder(): Promise<string>;

  getDropFrameRate(): Promise<string>;

  getVideoDecodeFramesPerSecond(): Promise<string>;

  getVideoOutputFramesPerSecond(): Promise<string>;

  getAudioCachedDuration(): Promise<number>;

  getVideoCachedDuration(): Promise<number>;

  getAudioCachedBytes(): Promise<number>;

  getVideoCachedBytes(): Promise<number>;

  getAudioCachedPackets(): Promise<number>;

  getVideoCachedPackets(): Promise<number>;
}
