export interface RouteResult {
  resultCode: RouteResultCode
  data: RouteResultData
}

export type RouteResultData = any

export enum RouteResultCode {
  ROUTE_RESULT_OK = 0,
  ROUTE_RESULT_CANCELED = 1,
}
