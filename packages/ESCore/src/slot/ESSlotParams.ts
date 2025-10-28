import {
  RouteLocationNamedRaw,
  RouteLocationPathRaw,
  RouteLocationUrlRaw,
} from "@extscreen/es3-router";

export type ESSlotParams =
  (RouteLocationPathRaw & ESSlotExtraParams) |
  (RouteLocationNamedRaw & ESSlotExtraParams) |
  (RouteLocationUrlRaw & ESSlotExtraParams)

export interface ESSlotExtraParams {
  [prop: string]: any
}
