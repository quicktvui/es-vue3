import {
  RouteLocationNamedRaw,
  RouteLocationPathRaw,
  RouteLocationUrlRaw,
} from "@extscreen/es3-router";

export type ESAppParams =
  (RouteLocationPathRaw & ESAppExtraParams) |
  (RouteLocationNamedRaw & ESAppExtraParams) |
  (RouteLocationUrlRaw & ESAppExtraParams)

export interface ESAppExtraParams {
  [prop: string]: any
}
