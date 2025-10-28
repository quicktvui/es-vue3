import {
  HistoryLocation,
  LifecycleState,
  RouteLocationRaw,
  Router,
  RouteRecordRaw,
  RouterHistory,
} from "@extscreen/es3-router";
import { EventBus } from "@extscreen/es3-vue";
import { createESRouterKeyManager, ESRouterKeyManager } from "./ESRouterKeyManager";
import {
  createESRouterLifecycleManager,
  ESRouterLifecycleManager,
} from "./ESRouterLifecycleManager";
import { ESSlotEventName } from "../slot";

export interface ESRouterOptions {
  limit?: number;
  main?: string;
  error?: string;
  routes: Readonly<RouteRecordRaw[]>;
}

export interface ESRouter extends Router {}

export function initESRouter(router?: ESRouter): Router | undefined {
  if (!router) {
    return router;
  }
  //-----------------------------------------------------------------------------------
  // 判断路由的类型
  // const routeTypes = router.options.types
  // const index = routeTypes.findIndex((type) => type == ESRouteType.ES_ROUTE_TYPE_SLOT)
  // const supportSlot = index > -1

  //按键管理
  const routerKeyManager: ESRouterKeyManager = createESRouterKeyManager(router);
  //声明周期
  const routerLifecycleManager: ESRouterLifecycleManager = createESRouterLifecycleManager();
  //
  const routerHistory: RouterHistory = router.getRouterHistory();
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //----------------------------------------------------------------------------------------------
  // 快应用生命周期:   LifecycleChange、OnNewIntent
  // 快应用按键事件:   hardwareBackPress、DispatchKeyEvent
  //----------------------------------------------------------------------------------------------
  EventBus.$on("hardwareBackPress", () => {
    console.log("ESRouter: " + "native event:hardwareBackPress");
    const historyLocationList = routerHistory.getHistoryLocations();
    if (historyLocationList && historyLocationList.length > 0) {
      const topHistoryLocation = historyLocationList[historyLocationList.length - 1];
      routerKeyManager.dispatchBackPressed(topHistoryLocation);
    }
  });
  EventBus.$on("DispatchKeyEvent", (keyEvent) => {
    console.log("ESRouter: " + "native event:DispatchKeyEvent", keyEvent);
    const historyLocationList = routerHistory.getHistoryLocations();
    if (historyLocationList && historyLocationList.length > 0) {
      const topHistoryLocation = historyLocationList[historyLocationList.length - 1];
      routerKeyManager.dispatchKeyEvent(topHistoryLocation, keyEvent);
    }
  });
  //---------------------------------RouterLifecycleManager-----------------------------------------
  EventBus.$on("LifecycleChange", (event) => {
    console.log("ESRouter: " + "native event:LifecycleChange", event);
    const historyLocationList = routerHistory.getHistoryLocations();
    if (historyLocationList && historyLocationList.length > 0) {
      const topHistoryLocation = historyLocationList[historyLocationList.length - 1];
      if (event === "onCreate") {
        routerLifecycleManager.onESCreate(topHistoryLocation);
      } else if (event === "onRestart") {
        routerLifecycleManager.onESRestart(topHistoryLocation);
      } else if (event === "onStart") {
        //20250610:使用router进行生命周期的处理 1.2.0版本
        // routerLifecycleManager.onESStart(topHistoryLocation);
      } else if (event === "onResume") {
        //20250610:使用router进行生命周期的处理 1.2.0版本
        // routerLifecycleManager.onESResume(topHistoryLocation);
        console.log("ESRouter: " + "使用router进行生命周期的处理");
        router.setActive(true);
      } else if (event === "onPause") {
        routerLifecycleManager.onESPause(topHistoryLocation);
        router.setActive(false);
      } else if (event === "onStop") {
        routerLifecycleManager.onESStop(topHistoryLocation);
      } else if (event === "onDestroy") {
        routerLifecycleManager.onESDestroy(topHistoryLocation);
      }
    }
  });
  EventBus.$on("OnNewIntent", (intent) => {
    console.log("ESRouter: " + "native event:OnNewIntent", intent);
    const historyLocationList = routerHistory.getHistoryLocations();
    if (historyLocationList && historyLocationList.length > 0) {
      const topHistoryLocation = historyLocationList[historyLocationList.length - 1];
      routerLifecycleManager.onESNewIntent(topHistoryLocation, intent);
    }
  });
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //##############################################################################################
  //----------------------------------------------------------------------------------------------
  // 插槽生命周期:   onStart、onResume、onPause、onStop、
  //               onBindViewHolder、onViewRecycled、onViewAttachedToWindow、onViewDetachedFromWindow
  // 插槽事件:      onCustomEvent、onCustomEvent
  // 插槽按键事件:   onDispatchKeyEvent、onHardwareBackPress
  //----------------------------------------------------------------------------------------------

  //------------------------------------------插槽声明周期---------------------------------------------
  EventBus.$on("onStart", (event: RouteLocationRaw) => {
    console.log("ESRouter: " + "native event:onStart", event);
    //获取先对应的插槽
    const location = getLocation(routerHistory, event);
    if (location) {
      // if (location.lifecycle >= LifecycleState.stop) {
      routerLifecycleManager.onESStart(location);
      // } else {
      //   console.log("ESRouter: " + "native event:onStart no op!", location.lifecycle)
      // }
    } else {
      console.log("ESRouter: " + "native event:onStart, location is null, so no op!");
    }
  });
  EventBus.$on("onResume", (event) => {
    console.log("ESRouter: " + "native event:onResume", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      // if (location.lifecycle >= LifecycleState.pause) {
      routerLifecycleManager.onESResume(location);
      // } else {
      //   console.log("ESRouter: " + "native event:onResume no op!", location.lifecycle)
      // }
    } else {
      console.log("ESRouter: " + "native event:onResume, location is null, so no op!");
    }
  });
  EventBus.$on("onPause", (event: RouteLocationRaw) => {
    console.log("ESRouter: " + "native event:onPause", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESPause(location);
    } else {
      console.log("ESRouter: " + "native event:onPause, location is null, so no op!");
    }
  });
  EventBus.$on("onStop", (event: RouteLocationRaw) => {
    console.log("ESRouter: " + "native event:onStop", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESStop(location);
    } else {
      console.log("ESRouter: " + "native event:onStop, location is null, so no op!");
    }
  });
  EventBus.$on("onBindViewHolder", (event) => {
    console.log("ESRouter: " + "native event:onBindViewHolder", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESBind(location, event.params);
    } else {
      console.log("ESRouter: " + "native event:onBindViewHolder, location is null, so no op!");
    }
  });
  EventBus.$on("onViewRecycled", (event: RouteLocationRaw) => {
    console.log("ESRouter: " + "native event:onViewRecycled", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESRecycle(location);
    } else {
      console.log("ESRouter: " + "native event:onViewRecycled, location is null, so no op!");
    }
  });
  EventBus.$on("onViewAttachedToWindow", (event) => {
    console.log("ESRouter: " + "native event:onViewAttachedToWindow", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESAttached(location, event.params);
    } else {
      console.log(
        "ESRouter: " + "native event:onViewAttachedToWindow, location is null, so no op!",
      );
    }
  });
  EventBus.$on("onViewDetachedFromWindow", (event) => {
    console.log("ESRouter: " + "native event:onViewDetachedFromWindow", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESDetached(location, event.params);
    } else {
      console.log(
        "ESRouter: " + "native event:onViewDetachedFromWindow, location is null, so no op!",
      );
    }
  });

  //------------------------------------------插槽事件---------------------------------------------
  /**
   *
   {
      "name": "BeJson",
      "key": "BeJson",
      "params": {
          "eventName": "BeJson",
          "eventData": any
      }
    }
   *
   */
  EventBus.$on("onCustomEvent", (event) => {
    console.log("ESRouter: " + "native event:onCustomEvent", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESSlotEvent(location, event.params);
    }
  });

  EventBus.$on("onFocusChanged", (event) => {
    console.log("ESRouter: " + "native event:onFocusChanged", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerLifecycleManager.onESSlotEvent(location, {
        eventName: ESSlotEventName.ES_SLOT_EVENT_NAME_FOCUS,
        eventData: {
          viewName: event.name,
          isFocused: event.params.gainFocus,
          direction: event.params.direction,
        },
      });
    }
  });
  //--------------------------------------插槽按键-------------------------------------------------
  EventBus.$on("onHardwareBackPress", (event) => {
    console.log("ESRouter: " + "native event:onHardwareBackPress");
    const location = getLocation(routerHistory, event);
    if (location) {
      routerKeyManager.dispatchBackPressed(location);
    } else {
      console.log("ESRouter: " + "native event:onHardwareBackPress, location is null, so no op!");
    }
  });
  EventBus.$on("onDispatchKeyEvent", (event) => {
    console.log("ESRouter: " + "native event:onDispatchKeyEvent", event);
    const location = getLocation(routerHistory, event);
    if (location) {
      routerKeyManager.dispatchKeyEvent(location, event.params);
    } else {
      console.log("ESRouter: " + "native event:onDispatchKeyEvent, location is null, so no op!");
    }
  });
  //##############################################################################################
  return router;
}

function getLocation(routerHistory: RouterHistory, route): HistoryLocation | undefined {
  if (!route || !route.key || !route.name) {
    return undefined;
  }
  const key = route.key;
  const historyLocationList = routerHistory.getHistoryLocations();
  const history = historyLocationList.find((history) => history.key == key);
  return history;
}
