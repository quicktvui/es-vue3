import { LifecycleState, HistoryLocation } from "@extscreen/es3-router";
import { ESParams } from "./ESParams";
import { ESData } from "./ESData";
import { triggerESLifecycle } from "@extscreen/es3-vue";

export interface ESRouterLifecycleManager {
  onESCreate(historyLocation: HistoryLocation, params?: ESParams): void;

  onESRestart(historyLocation: HistoryLocation): void;

  onESStart(historyLocation: HistoryLocation): void;

  onESResume(historyLocation: HistoryLocation): void;

  onESPause(historyLocation: HistoryLocation): void;

  onESStop(historyLocation: HistoryLocation): void;

  onESDestroy(historyLocation: HistoryLocation): void;

  onESNewIntent(historyLocation: HistoryLocation, intent?: ESData): void;

  //
  onESBind(historyLocation: HistoryLocation, data?: ESData): void;

  onESRecycle(historyLocation: HistoryLocation): void;

  onESAttached(historyLocation: HistoryLocation, data?: ESData): void;

  onESDetached(historyLocation: HistoryLocation, data?: ESData): void;

  onESSlotEvent(historyLocation: HistoryLocation, data?: ESData): void;
}

export function createESRouterLifecycleManager(): ESRouterLifecycleManager {
  function onESCreate(historyLocation: HistoryLocation, params?: ESParams): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.create) {
      historyLocation.lifecycle = LifecycleState.create;

      if (instance) {
        try {
          triggerESLifecycle(instance, "create", {});
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESCreate)) {
          // @ts-ignore
          instance.onESCreate({});
        }
      }
    }
  }

  function onESRestart(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    historyLocation.lifecycle = LifecycleState.restart;
    // @ts-ignore
    if (instance) {
      try {
        triggerESLifecycle(instance, "restart");
      } catch (e) {}

      // @ts-ignore
      if (isFunction(instance.onESRestart)) {
        // @ts-ignore
        instance.onESRestart();
      }
    }
  }

  function onESStart(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    historyLocation.lifecycle = LifecycleState.start;
    if (instance) {
      try {
        triggerESLifecycle(instance, "start");
      } catch (e) {}

      // @ts-ignore
      if (isFunction(instance.onESStart)) {
        // @ts-ignore
        instance.onESStart();
      }
    }
  }

  function onESResume(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    historyLocation.lifecycle = LifecycleState.resume;
    if (instance) {
      try {
        triggerESLifecycle(instance, "resume");
      } catch (e) {}

      // @ts-ignore
      if (isFunction(instance.onESResume)) {
        // @ts-ignore
        instance.onESResume();
      }
    }
  }

  function onESPause(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.pause) {
      historyLocation.lifecycle = LifecycleState.pause;
      if (instance) {
        try {
          triggerESLifecycle(instance, "pause");
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESPause)) {
          // @ts-ignore
          instance.onESPause();
        }
      }
    }
  }

  function onESStop(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.stop) {
      historyLocation.lifecycle = LifecycleState.stop;
      // @ts-ignore
      if (instance) {
        try {
          triggerESLifecycle(instance, "stop");
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESStop)) {
          // @ts-ignore
          instance.onESStop();
        }
      }
    }
  }

  function onESDestroy(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      historyLocation.lifecycle = LifecycleState.destroy;
      if (instance) {
        try {
          triggerESLifecycle(instance, "destroy");
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESDestroy)) {
          // @ts-ignore
          instance.onESDestroy();
        }
      }
    }
  }

  function onESNewIntent(historyLocation: HistoryLocation, intent?: ESData): void {
    const instance = historyLocation.instances;
    if (instance) {
      try {
        triggerESLifecycle(instance, "newIntent", intent);
      } catch (e) {}

      // @ts-ignore
      if (isFunction(instance.onESNewIntent)) {
        // @ts-ignore
        instance.onESNewIntent(intent);
      }
    }
  }

  function onESBind(historyLocation: HistoryLocation, data: ESData): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      if (instance) {
        try {
          triggerESLifecycle(instance, "bind", data);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESBind)) {
          // @ts-ignore
          instance.onESBind(data);
        }
      }
    }
  }

  function onESRecycle(historyLocation: HistoryLocation): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      if (instance) {
        try {
          triggerESLifecycle(instance, "recycle");
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESRecycle)) {
          // @ts-ignore
          instance.onESRecycle();
        }
      }
    }
  }

  function onESAttached(historyLocation: HistoryLocation, data?: ESData): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      if (instance) {
        try {
          triggerESLifecycle(instance, "attached", data);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESAttached)) {
          // @ts-ignore
          instance.onESAttached(data);
        }
      }
    }
  }

  function onESDetached(historyLocation: HistoryLocation, data?: ESData): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      if (instance) {
        try {
          triggerESLifecycle(instance, "detached", data);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESDetached)) {
          // @ts-ignore
          instance.onESDetached(data);
        }
      }
    }
  }

  function onESSlotEvent(historyLocation: HistoryLocation, data?: ESData): void {
    const instance = historyLocation.instances;
    if (historyLocation.lifecycle < LifecycleState.destroy) {
      if (instance) {
        try {
          triggerESLifecycle(instance, "slotEvent", data);
        } catch (e) {}

        // @ts-ignore
        if (isFunction(instance.onESSlotEvent)) {
          // @ts-ignore
          instance.onESSlotEvent(data);
        }
      }
    }
  }

  function isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
  }

  const manager: ESRouterLifecycleManager = {
    onESCreate,
    onESRestart,
    onESStart,
    onESResume,
    onESPause,
    onESStop,
    onESDestroy,
    onESNewIntent,
    onESBind,
    onESRecycle,
    onESAttached,
    onESDetached,
    onESSlotEvent,
  };
  return manager;
}
