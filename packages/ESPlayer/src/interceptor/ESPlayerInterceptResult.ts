//

import {ESIPlayerInterceptor} from "./ESIPlayerInterceptor";

export interface ESPlayerInterceptResult {
  readonly interceptor?: ESIPlayerInterceptor
  result?: any
}
