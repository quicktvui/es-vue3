import {
  ESIPlayerInterceptor,
  ESMediaMetadata,
  ESMediaSourceList,
  ESPlayerPosition
} from "@extscreen/es3-player";

export interface ESMediaItem {

  //video
  readonly id?: string | number
  readonly mediaSourceList?: ESMediaSourceList
  readonly playerType?: number

  //ad
  readonly previousRollADList?: ESMediaSourceList
  readonly middleRollADList?: ESMediaSourceList
  readonly postRollADList?: ESMediaSourceList
  readonly adPlayerType?: number

  //
  readonly interceptors?: Array<ESIPlayerInterceptor>
  //
  readonly position?: ESPlayerPosition

  metadata?: ESMediaMetadata

  [prop: string]: any
}
