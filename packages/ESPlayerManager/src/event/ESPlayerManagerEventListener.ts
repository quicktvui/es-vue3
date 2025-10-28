/**
 *
 */
import { ESPlayerEventListener, ESPlayerPlayMode, ESPlayerWindowType } from "@extscreen/es3-player";
import { ESMediaItemList } from "../core/ESMediaItemList";
import { ESMediaItem } from "../core/ESMediaItem";
import SparseArray from "../utils/SparseArray";
import { ESIPlayerManager } from "../core/ESIPlayerManager";

export interface ESPlayerManagerEventListener
  extends Omit<ESPlayerEventListener, "setPlayer" | "getPlayer"> {
  setPlayerManager(player: ESIPlayerManager): void;

  getPlayerManager(): ESIPlayerManager | null | undefined;

  onPlayerPlayMediaList(playList: ESMediaItemList): void;

  onPlayerMediaListInitialized(mediaItemList: SparseArray<ESMediaItem>): void;

  onPlayerPlayMedia(mediaItem: ESMediaItem): void;

  onPlayerNoMediaCanPlay(next: boolean): void;

  onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void;

  onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void;

  onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void;

  onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void;
}
