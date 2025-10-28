import {inject} from 'vue'
import {nativeRouterKey, routeLocationKey, routerKey} from './injectionSymbols'
import {Router} from './router'
import {RouteLocationNormalizedLoaded} from './types'
import {ESNativeRouter} from "./es/ESNativeRouter";

/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */
export function useESRouter(): Router {
  return inject(routerKey)!
}

export function useESNativeRouter(): ESNativeRouter {
  return inject(nativeRouterKey)!
}

/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */
export function useESRoute(): RouteLocationNormalizedLoaded {
  return inject(routeLocationKey)!
}
