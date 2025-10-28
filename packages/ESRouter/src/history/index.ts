import {createRouter, Router, RouterOptions} from "../router";

import {createESHistory} from './es';
import {ESRouteType} from "../matcher/types";

export function createESRouter(options: {
  main?: string;
  error?: string;
  routes;
  limit?: number;
}): Router {
  const option: RouterOptions = {
    main: options.main,
    error: options.error,
    history: createESHistory(),
    routes: options.routes,
    sensitive: false,
    strict: false,
    end: false,
    limit: options.limit,
    types: [ESRouteType.ES_ROUTE_TYPE_PAGE, ESRouteType.ES_ROUTE_TYPE_DIALOG]
  };
  const router: Router = createRouter(option);
  return router;
}

export function createESSlot(options: {
  routes;
}): Router {
  const option: RouterOptions = {
    history: createESHistory(),
    routes: options.routes,
    sensitive: false,
    strict: false,
    end: false,
    types: [ESRouteType.ES_ROUTE_TYPE_SLOT]
  };
  const router: Router = createRouter(option);
  return router;
}

export * from './es';
