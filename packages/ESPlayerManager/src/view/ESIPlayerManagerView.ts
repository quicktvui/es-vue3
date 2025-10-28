/**
 *
 */
import {
  ESIPlayerView,
  ESPlayerPlayMode,
  ESPlayerWindowType
} from "@extscreen/es3-player";
import {ESMediaItemList} from "../core/ESMediaItemList";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {ESMediaItem} from "../core/ESMediaItem";
import {ESKeyEvent} from "@extscreen/es3-core";
import SparseArray from "../utils/SparseArray";

export interface ESIPlayerManagerView extends Omit<ESIPlayerView, 'setPlayer' | 'getPlayer'> {

  setPlayerManager(player: ESIPlayerManager): void

  getPlayerManager(): ESIPlayerManager | null | undefined

  onPlayerPlayMediaList(playList: ESMediaItemList): void

  onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void

  onPlayerPlayMedia(mediaItem: ESMediaItem): void

  onPlayerNoMediaCanPlay(next: boolean): void

  onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void

  onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void

  onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void

  onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void

  onKeyDown(keyEvent: ESKeyEvent): boolean

  onKeyUp(keyEvent: ESKeyEvent): boolean

  onBackPressed(): boolean
}
