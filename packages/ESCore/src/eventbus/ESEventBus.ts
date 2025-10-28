import {IESManager} from "../core";
import {App} from "vue";
import {ESEventBusKey} from "../useApi";
import {ESEventBusCallback} from "./ESEventBusCallback";
import {ESEventBusContext} from "./ESEventBusContext";
import {ESEventBusEvent} from "./ESEventBusEvent";
import {ESEventBusArg} from "./ESEventBusArg";

export interface ESEventBus extends IESManager {

  on(event: string | Array<string>, callback: ESEventBusCallback, context?: ESEventBusContext): void

  once(event: string, callback: ESEventBusCallback, context?: ESEventBusContext): void

  emit(event: string, ...args: ESEventBusArg[]): void

  off(event?: string | Array<string>, callback?: ESEventBusCallback): void
}


export function createESEventBus(): ESEventBus {

  const eventListeners: Map<string, Array<ESEventBusEvent>> =
    new Map<string, Array<ESEventBusEvent>>()

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true)
    });
  }

  function on(event: string | Array<string>, callback: ESEventBusCallback, context?: ESEventBusContext): void {
    if (Array.isArray(event)) {
      event.forEach((eventName) => {
        on(eventName, callback, context);
      });
    } else {
      if (!eventListeners.has(event)) {
        eventListeners.set(event, [])
      }
      eventListeners.get(event)?.push({
        fn: callback,
        context: context,
      })
    }
  }

  function emit(event: string, ...args: ESEventBusArg[]): void {
    const callbackList = eventListeners.get(event)
    if (callbackList && callbackList.length > 0) {
      const len = callbackList.length;
      for (let i = 0; i < len; i += 1) {
        const e: ESEventBusEvent = callbackList[i]
        if (e) {
          e.fn?.apply(e.context, args);
        }
      }
    }
  }

  function once(event: string, callback: ESEventBusCallback, context?: ESEventBusContext): void {
    function listener(...args) {
      off(event, listener);
      callback.apply(context, args);
    }

    if (!eventListeners.has(event)) {
      eventListeners.set(event, [])
    }
    eventListeners.get(event)?.push({
      fn: listener,
      context: context,
      wrapper: callback
    })
  }

  function off(event?: string | Array<string>, callback?: ESEventBusCallback): void {
    if (!event && !callback) {
      eventListeners.clear()
      return;
    }
    if (Array.isArray(event)) {
      event.forEach((eventName) => {
        off(eventName, callback);
      });
      return;
    }
    let callbackList = eventListeners.get(event!)
    if (!callbackList) {
      return;
    }
    if (!callback) {
      eventListeners.set(event!, [])
      return;
    }
    const length = callbackList.length;
    for (let i = 0; i < length; i++) {
      const existCallback: ESEventBusEvent = callbackList[i];
      if (existCallback.fn === callback || existCallback.wrapper === callback) {
        callbackList.splice(i, 1);
        break;
      }
    }
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESEventBusKey, instance)
    },
    init,
    on,
    once,
    emit,
    off
  }
}
