import {ESNativeRouter} from "./es/ESNativeRouter";

export {createRouterMatcher} from './matcher'
export type {RouterMatcher} from './matcher'

export {parseQuery, stringifyQuery} from './query'
export type {
  LocationQuery,
  LocationQueryRaw,
  LocationQueryValue,
  LocationQueryValueRaw,
} from './query'

export type {RouterHistory, HistoryState} from './history/common'

export type {RouteRecord, RouteRecordNormalized} from './matcher/types'

export {LifecycleState, ESRouteLaunchMode, ESRouteType} from './matcher/types'

export type {
  PathParserOptions,
  _PathParserOptions,
} from './matcher/pathParserRanker'

export {
  routeLocationKey,
  routerViewLocationKey,
  routerKey,
  matchedRouteKey,
  viewDepthKey,
  routerViewInstanceKey,
  routeViewInstancesKey,
} from './injectionSymbols'

export {START_LOCATION_NORMALIZED as START_LOCATION} from './types'
export type {
  // route location
  _RouteLocationBase,
  MatcherLocationAsPath,
  LocationAsRelativeRaw,
  RouteQueryAndHash,
  RouteLocationRaw,
  RouteLocation,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteParams,
  RouteParamsRaw,
  RouteParamValue,
  RouteParamValueRaw,
  RouteLocationNamedRaw,
  RouteLocationPathRaw,
  RouteLocationUrlRaw,
  RouteLocationMatched,
  RouteLocationOptions,
  RouteRecordRedirectOption,
  // route records
  _RouteRecordBase,
  RouteMeta,
  RouteComponent,
  // RawRouteComponent,
  RouteRecordName,
  RouteRecordRaw,
  NavigationGuard,
  NavigationGuardNext,
  NavigationGuardWithThis,
  NavigationHookAfter,
} from './types'

export {
  createESRouter,
  createESSlot
} from './history'

export type {Router, RouterOptions, RouterScrollBehavior} from './router'

export {NavigationFailureType, isNavigationFailure} from './errors'
export type {
  NavigationFailure,
  ErrorTypes,
  NavigationRedirectError,
} from './errors'

export {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  loadRouteLocation,
} from './navigationGuards'
export {RouterLink, useLink} from './RouterLink'
export type {
  _RouterLinkI,
  RouterLinkProps,
  UseLinkOptions,
} from './RouterLink'

//------------------------------------------------------------------------------------
export type {RouteResult} from './result/RouteResult'
export type {RouteResultData} from './result/RouteResult'
export {RouteResultCode} from './result/RouteResult'
//------------------------------------------------------------------------------------

export {RouterView} from './RouterView'
export type {RouterViewProps} from './RouterView'

//------------------------------------------------------------------------------------

export {SlotView} from './SlotView'
export type {SlotViewProps} from './SlotView'

//------------------------------------------------------------------------------------

export type {TypesConfig} from './config'

export type {HistoryLocation} from './history/common'

//------------------------------------------------------------------------------------
export type {
  ESNativeRouter,
} from './es/ESNativeRouter'
//
export type {ESNativeRouterLaunchMode} from './es/ESNativeRouterLaunchMode'
export type {ESNativeRouterSplash} from './es/ESNativeRouterSplash'
//------------------------------------------------------------------------------------

export * from './useApi'

export * from './globalExtensions'

/**
 * The official Router for Vue 3.
 *
 * @packageDocumentation
 */

