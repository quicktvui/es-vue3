import {RouteResult, RouteResultData} from "./RouteResult";

export interface RouteResultCallback {
  onResult(result: RouteResult): Promise<RouteResultData> | void
}
