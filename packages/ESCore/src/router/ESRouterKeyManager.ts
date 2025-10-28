import { HistoryLocation, Router } from "@extscreen/es3-router";
import { ESKeyEvent } from "../key";
import { triggerESLifecycle, hasESLifecycleHook, ESLifecycleKeys } from "@extscreen/es3-vue";

export interface ESRouterKeyManager {
  dispatchBackPressed(historyLocation: HistoryLocation): void;

  dispatchKeyEvent(historyLocation: HistoryLocation, keyEvent: ESKeyEvent): void;
}

export function createESRouterKeyManager(router: Router): ESRouterKeyManager {
  function dispatchBackPressed(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    if (instance) {
      const hasHooks = hasESLifecycleHook(instance, ESLifecycleKeys.ES_BACK_PRESSED);
      // @ts-ignore
      if (isFunction(instance.onBackPressed) || hasHooks) {
        //1.
        if (hasHooks) {
          try {
            triggerESLifecycle(instance, "backPressed");
          } catch (e) {}
        }
        //2.
        // @ts-ignore
        if (isFunction(instance.onBackPressed)) {
          // @ts-ignore
          instance.onBackPressed();
        }
      } else {
        router.back();
      }
    }
  }

  function dispatchKeyEvent(historyLocation: HistoryLocation, keyEvent: ESKeyEvent): void {
    const instance = historyLocation.instances;
    if (!instance) {
      return;
    }
    const hasHooks = hasESLifecycleHook(instance, ESLifecycleKeys.ES_DISPATCH_KEY_EVENT);
    // @ts-ignore
    if (isFunction(instance.onDispatchKeyEvent) || hasHooks) {
      //1.
      if (hasHooks) {
        try {
          triggerESLifecycle(instance, "dispatchKeyEvent", keyEvent);
        } catch (e) {}
      }
      //2.
      // @ts-ignore
      if (isFunction(instance.onDispatchKeyEvent)) {
        // @ts-ignore
        instance.onDispatchKeyEvent(keyEvent);
      }
    } else {
      if (keyEvent && keyEvent.action === 0) {
        try {
          triggerESLifecycle(instance, "keyDown", keyEvent);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onKeyDown)) {
          // @ts-ignore
          instance.onKeyDown(keyEvent);
        }
      } else if (keyEvent && keyEvent.action === 1) {
        try {
          triggerESLifecycle(instance!, "keyUp", keyEvent);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onKeyUp)) {
          // @ts-ignore
          instance.onKeyUp(keyEvent);
        }
      }
    }
  }

  function isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
  }

  const routerKeyManager: ESRouterKeyManager = {
    dispatchBackPressed,
    dispatchKeyEvent,
  };

  return routerKeyManager;
}
