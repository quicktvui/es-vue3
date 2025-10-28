import {ESMediaItem} from "./ESMediaItem";
import {ESIPlayerInterceptor, ESMediaMetadata} from "@extscreen/es3-player";

export interface ESMediaItemList {
  readonly index: number
  readonly list: Array<ESMediaItem>,
  readonly interceptors?: Array<ESIPlayerInterceptor>
  metadata?: ESMediaMetadata

  [prop: string]: any
}
