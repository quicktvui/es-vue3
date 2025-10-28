import {ESPlayerInterceptorType} from "./ESPlayerInterceptorType";
import {ESPlayerInterceptResult} from "./ESPlayerInterceptResult";

export interface ESIPlayerInterceptor {

  id: string
  type: ESPlayerInterceptorType

  intercept(...params: Array<any>): Promise<ESPlayerInterceptResult>

  release(): void
}
