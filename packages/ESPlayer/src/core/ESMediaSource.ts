import {ESPlayerDefinition} from "../definition/ESPlayerDefinition";
import {ESIPlayerInterceptor} from "../interceptor/ESIPlayerInterceptor";
import {ESMediaMetadata} from "./ESMediaMetadata";

export interface ESMediaSource {
  readonly id?: string | number
  readonly uri: any
  readonly definition?: ESPlayerDefinition
  readonly interceptors?: Array<ESIPlayerInterceptor>
  metadata?: ESMediaMetadata

  [prop: string]: any
}
