import { Router, RouteLocationRaw, NavigationFailure } from "@extscreen/es3-router";
import { EventBus } from "@extscreen/es3-vue";
import { App } from "vue";
import { ESRouterManagerKey } from "../useApi";

export interface ESRouterManager {
  install(app: App): void;

  init(...params: any[]);

  route(): void;

  push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;

  splice(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;

  setAutoRedirectEnabled(enabled: boolean);

  isAutoRedirectEnabled(): boolean;

  normalizeParams(routerLocation: any): any;
}

export interface ESRouterEvent {
  eventName: string;
  eventValue: any;
}

export function createESRouterManager(router?: Router): ESRouterManager {
  const TAG = "ESRouterManager";

  let eventQueue = new Array<ESRouterEvent>();
  let onAppCreated = false;

  let autoRedirectEnabled = true;

  function init(): void {
    //------------------------------------------插槽创建和销毁-----------------------------------------
    // 插槽创建和销毁: onRequestCreateSlot、onRequestDestroySlot
    //
    EventBus.$on("onRequestCreateSlot", (to: RouteLocationRaw) => {
      console.log(TAG, "native event:onRequestCreateSlot", to);
      if (onAppCreated) {
        push(to).then(() => {});
      } else {
        eventQueue.push({
          eventName: "onRequestCreateSlot",
          eventValue: to,
        });
      }
    });
    EventBus.$on("onRequestDestroySlot", (to: RouteLocationRaw) => {
      console.log(TAG, "native event:onRequestDestroySlot", to);
      if (onAppCreated) {
        splice(to).then(() => {});
      } else {
        eventQueue.push({
          eventName: "onRequestDestroySlot",
          eventValue: to,
        });
      }
    });
  }

  function handleRouteEvent(event: ESRouterEvent): Promise<NavigationFailure | void | undefined> {
    try {
      const eventName = event.eventName;
      const eventValue = event.eventValue;
      switch (eventName) {
        case "onRequestCreateSlot":
          return push(eventValue);
        case "onRequestDestroySlot":
          return splice(eventValue);
      }
    } catch (e) {
      console.log(TAG, "handleRouteEvent error!", e);
    }
    return Promise.resolve();
  }

  function route(): void {
    onAppCreated = true;

    let promise = new Promise<NavigationFailure | void | undefined>((resolve) => {
      resolve();
    });

    if (eventQueue && eventQueue.length > 0) {
      eventQueue.map((event) => {
        promise = promise.then(() => {
          return handleRouteEvent(event);
        });
      });
    }
    promise.then(() => {
      eventQueue = [];
      console.log(TAG, "route finished");
    });
  }

  /**
   * push
   */
  function push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    console.log(TAG, "push:", to);
    const route = normalizeParams(to);
    if (router && route) {
      return router.push(route);
    }
    return Promise.resolve();
  }

  /**
   * splice
   */
  function splice(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    console.log(TAG, "splice:", to);
    const route = normalizeParams(to);
    if (router && route) {
      const ret = router.splice(route);
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  /**
   * 兼容旧版本路由参数
   */
  function normalizeParams(routerLocation: any): any {
    //如果url不为空，则说明是老版本协议，赋值成新版本的协议
    if (routerLocation.url) {
      routerLocation.name = routerLocation.url;
    }

    //main
    //name 和 path都为空，则使用main
    if (!routerLocation.name && !routerLocation.path && router) {
      routerLocation.name = router?.options.main;
    }

    //error
    if (!(_isRoutePathValid(routerLocation.path) || _isRouteNameValid(routerLocation.name))) {
      routerLocation.name = router?.options.error;
    }

    //name和path有一个不为空
    if (routerLocation.name || routerLocation.path) {
    } else {
      console.error(
        '[ESCore] Invalid entrance: missing "name" or "path".',
        routerLocation.name,
        routerLocation.path,
      );
      // return null;
    }
    return routerLocation;
  }

  const _isRoutePathValid = (path) => {
    if (path !== undefined && path !== "") {
      let index = router?.options.routes.findIndex((item) => item.path === `/${path}`);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  };
  const _isRouteNameValid = (name) => {
    if (name !== undefined && name !== "") {
      let index = router?.options.routes.findIndex((item) => item.name === `${name}`);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  };

  function setAutoRedirectEnabled(enabled: boolean) {
    autoRedirectEnabled = enabled;
  }

  function isAutoRedirectEnabled(): boolean {
    return autoRedirectEnabled;
  }

  const routerSlotManager: ESRouterManager = {
    install: function (app: App) {
      const routerManager = this;
      app.provide(ESRouterManagerKey, routerManager);
    },
    init,
    route,
    push,
    splice,
    setAutoRedirectEnabled,
    isAutoRedirectEnabled,
    normalizeParams,
  };
  return routerSlotManager;
}
