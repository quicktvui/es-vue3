//
import {ESIPlayerInterceptor} from "./ESIPlayerInterceptor";
import {ESPlayerError} from "../error/ESPlayerError";

export interface ESPlayerInterceptError {
  readonly interceptor?: ESIPlayerInterceptor
  readonly error?: ESPlayerError
}
