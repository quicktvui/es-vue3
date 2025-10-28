import {ESIPlayer, ESPlayerPlayMode, ESPlayerWindowType} from "@extscreen/es3-player";
import {ESKeyEvent} from "@extscreen/es3-core";
import {ESMediaItem} from "./ESMediaItem";
import {ESMediaItemList} from "./ESMediaItemList";
import {ESIPlayerManagerView} from "../view/ESIPlayerManagerView";
import SparseArray from "../utils/SparseArray";

export interface ESIPlayerManager
  extends Omit<ESIPlayer, 'getComponentInfo' | 'initComponent' | 'getId' | 'getType'> {

  playMediaList(playList: ESMediaItemList): void

  playMediaByIndex(index: number): void

  playMediaById(id: string): void

  playMedia(mediaItem: ESMediaItem): void

  addMediaToLast(mediaItemList: Array<ESMediaItem>): void

  addMediaToFirst(mediaItemList: Array<ESMediaItem>): void

  addMediaToIndex(index: number, mediaItemList: Array<ESMediaItem>): void

  replaceMedia(beginIndex: number, mediaItemList: Array<ESMediaItem>): void

  getMediaList(): SparseArray<ESMediaItem> | null

  resetMediaList(): void

  getMedia(index: number): ESMediaItem | null

  getPlayingMediaIndex(): number

  getPlayingMedia(): ESMediaItem | null

  getWindowType(): ESPlayerWindowType

  getPlayerView(name: string): ESIPlayerManagerView

  setFloatWindow(): void

  setSmallWindow(): void

  setFullWindow(): void

  setSizeDimension(width: number, height: number, quickUpdate: boolean): void

  setWindowType(windowType: ESPlayerWindowType): void

  setPlayMediaListMode(playMode: ESPlayerPlayMode): void

  canPlayNextMedia(): boolean

  playNextMedia(): void

  canPlayPreviousMedia(): boolean

  playPreviousMedia(): void

  onKeyDown(keyEvent: ESKeyEvent): boolean

  onKeyUp(keyEvent: ESKeyEvent): boolean

  onBackPressed(): boolean
}
