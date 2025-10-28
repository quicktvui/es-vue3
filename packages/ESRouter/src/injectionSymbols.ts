import type {InjectionKey, ComputedRef, Ref} from 'vue'
import {RouteLocationNormalizedLoaded, RouteRecordRaw} from './types'
import {RouteRecordNormalized} from './matcher/types'
import type {Router} from './router'
import {NavigationType, RouterHistory} from "./history/common";
import {ComponentPublicInstance} from "vue";
import {ESNativeRouter} from "./es/ESNativeRouter";

/**
 * RouteRecord being rendered by the closest ancestor Router View. Used for
 * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
 * Location Matched
 *
 * @internal
 */
export const matchedRouteKey = Symbol(
  __DEV__ ? 'router view location matched' : ''
) as InjectionKey<ComputedRef<RouteRecordNormalized | undefined>>

/**
 * Allows overriding the router view depth to control which component in
 * `matched` is rendered. rvd stands for Router View Depth
 *
 * @internal
 */
export const viewDepthKey = Symbol(
  __DEV__ ? 'router view depth' : ''
) as InjectionKey<Ref<number> | number>

/**
 * Allows overriding the router instance returned by `useRouter` in tests. r
 * stands for router
 *
 * @internal
 */
export const routerKey = Symbol(__DEV__ ? 'router' : '') as InjectionKey<Router>


export const nativeRouterKey = Symbol(__DEV__ ? 'native router' : '') as InjectionKey<ESNativeRouter>


/**
 * Allows overriding the current route returned by `useRoute` in tests. rl
 * stands for route location
 *
 * @internal
 */
export const routeLocationKey = Symbol(
  __DEV__ ? 'route location' : ''
) as InjectionKey<RouteLocationNormalizedLoaded>

/**
 * Allows overriding the current route used by router-view. Internally this is
 * used when the `route` prop is passed.
 *
 * @internal
 */
export const routerViewLocationKey = Symbol(
  __DEV__ ? 'router view location' : ''
) as InjectionKey<Ref<RouteLocationNormalizedLoaded>>


export const routerHistoryKey = Symbol(
  __DEV__ ? 'router history' : ''
) as InjectionKey<RouterHistory>


export const routerRecordRawKey = Symbol(
  __DEV__ ? 'router record raw array' : ''
) as InjectionKey<RouteRecordRaw[]>


export const navigationTypeKey = Symbol(
  __DEV__ ? 'navigation type' : ''
) as InjectionKey<Ref<NavigationType>>


export const routerComponentInstanceKey = Symbol(
  __DEV__ ? 'router component instance' : ''
) as InjectionKey<Ref<ComponentPublicInstance | undefined>>


export const routerViewNameKey = Symbol(
  __DEV__ ? 'router view name' : ''
) as InjectionKey<Ref<string>>


//---------------------------------------------------------------
export const routerViewInstanceKey = Symbol(
  __DEV__ ? 'router view instance' : ''
) as InjectionKey<Ref<ComponentPublicInstance | undefined>>


export const routeViewInstancesKey = Symbol(
  __DEV__ ? 'route view instance list' : ''
) as InjectionKey<Array<Ref<ComponentPublicInstance | undefined>>>
