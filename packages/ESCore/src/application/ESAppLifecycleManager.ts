import { ComponentPublicInstance } from "@vue/runtime-core";
import { ESAppParams } from "./ESAppParams";
import { ESData } from "../router";
import { ESApp, EventBus, triggerESLifecycle } from "@extscreen/es3-vue";

export interface ESAppLifecycleManager {
  init(app: ESApp, applicationInstance: ComponentPublicInstance): void;

  onESCreate(
    applicationInstance: ComponentPublicInstance,
    app: ESApp,
    params?: ESAppParams,
  ): void | Promise<any>;

  onESCreated(applicationInstance: ComponentPublicInstance, success: boolean): void;

  onESRestart(applicationInstance: ComponentPublicInstance): void;

  onESStart(applicationInstance: ComponentPublicInstance): void;

  onESResume(applicationInstance: ComponentPublicInstance): void;

  onESPause(applicationInstance: ComponentPublicInstance): void;

  onESStop(applicationInstance: ComponentPublicInstance): void;

  onESDestroy(applicationInstance: ComponentPublicInstance): void;

  onESNewIntent(applicationInstance: ComponentPublicInstance, intent?: ESData): void;
}

export function createESAppLifecycleManager(): ESAppLifecycleManager {
  const TAG = "ESAppLifecycleManager";

  function init(app: ESApp, applicationInstance: ComponentPublicInstance): void {
    EventBus.$on("LifecycleChange", (event) => {
      if (event === "onCreate") {
        onESCreate(applicationInstance, app);
      } else if (event === "onRestart") {
        onESRestart(applicationInstance);
      } else if (event === "onStart") {
        onESStart(applicationInstance);
      } else if (event === "onResume") {
        onESResume(applicationInstance);
      } else if (event === "onPause") {
        onESPause(applicationInstance);
      } else if (event === "onStop") {
        onESStop(applicationInstance);
      } else if (event === "onDestroy") {
        onESDestroy(applicationInstance);
      }
    });
    EventBus.$on("OnNewIntent", (intent) => {
      onESNewIntent(applicationInstance);
    });
  }

  function onESCreate(
    applicationInstance: ComponentPublicInstance,
    app: ESApp,
    params?: ESAppParams,
  ): void | Promise<any> {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "create", app, params);
      } catch (e) {}

      if (_isFunction(applicationInstance["onESCreate"])) {
        // let result = applicationInstance['onESCreate'](app, applicationProps);
        return applicationInstance["onESCreate"](app, params);
      }
    } catch (e) {
      console.log(TAG, "onESCreate error ", e);
    }
  }

  function onESCreated(applicationInstance: ComponentPublicInstance, success: boolean): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "created", success);
      } catch (e) {}

      if (_isFunction(applicationInstance["onESCreated"])) {
        applicationInstance["onESCreated"](success);
      }
    } catch (e) {
      console.log(TAG, "onESCreated error ", e);
    }
  }

  function onESRestart(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "restart");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESRestart"])) {
        applicationInstance["onESRestart"]();
      }
    } catch (e) {
      console.log(TAG, "onESRestart error ", e);
    }
  }

  function onESStart(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "start");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESStart"])) {
        applicationInstance["onESStart"]();
      }
    } catch (e) {
      console.log(TAG, "onESStart error ", e);
    }
  }

  function onESResume(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "resume");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESResume"])) {
        applicationInstance["onESResume"]();
      }
    } catch (e) {
      console.log(TAG, "onESResume error ", e);
    }
  }

  function onESPause(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "pause");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESPause"])) {
        applicationInstance["onESPause"]();
      }
    } catch (e) {
      console.log(TAG, "onESPause error ", e);
    }
  }

  function onESStop(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "stop");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESStop"])) {
        applicationInstance["onESStop"]();
      }
    } catch (e) {
      console.log(TAG, "onESStop error ", e);
    }
  }

  function onESDestroy(applicationInstance: ComponentPublicInstance): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "destroy");
      } catch (e) {}

      if (_isFunction(applicationInstance["onESDestroy"])) {
        applicationInstance["onESDestroy"]();
      }
    } catch (e) {
      console.log(TAG, "onESDestroy error ", e);
    }
  }

  function onESNewIntent(applicationInstance: ComponentPublicInstance, intent?: ESData): void {
    try {
      //
      try {
        triggerESLifecycle(applicationInstance, "newIntent", intent);
      } catch (e) {}

      if (_isFunction(applicationInstance["onESNewIntent"])) {
        applicationInstance["onESNewIntent"](intent);
      }
    } catch (e) {
      console.log(TAG, "onESNewIntent error ", e);
    }
  }

  function _isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
  }

  const manager: ESAppLifecycleManager = {
    init,
    onESCreate,
    onESCreated,
    onESRestart,
    onESStart,
    onESResume,
    onESPause,
    onESStop,
    onESDestroy,
    onESNewIntent,
  };
  return manager;
}
