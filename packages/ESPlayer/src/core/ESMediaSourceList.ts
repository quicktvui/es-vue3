import {ESMediaSource} from "./ESMediaSource";
import {ESPlayerPosition} from "./ESPlayerPosition";
import {ESIPlayerInterceptor} from "../interceptor/ESIPlayerInterceptor";
import {ESMediaMetadata} from "./ESMediaMetadata";

export interface ESMediaSourceList {
  readonly index: number
  readonly list: Array<ESMediaSource>
  readonly support?: boolean
  readonly interceptors?: Array<ESIPlayerInterceptor>
  metadata?: ESMediaMetadata
  position?: ESPlayerPosition

  [prop: string]: any
}
