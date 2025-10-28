import {
  RouteLocationNamedRaw,
  RouteLocationPathRaw,
  RouteLocationUrlRaw,
} from "@extscreen/es3-router";

export type ESPageParams =
  (RouteLocationPathRaw & ESPageExtraParams) |
  (RouteLocationNamedRaw & ESPageExtraParams) |
  (RouteLocationUrlRaw & ESPageExtraParams)

export interface ESPageExtraParams {
  [prop: string]: any
}
