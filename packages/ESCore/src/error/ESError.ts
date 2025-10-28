import { IESManager } from "../core";
import { App } from "vue";
import { ESErrorKey } from "../useApi";
import { ESErrorListener } from "./ESErrorListener";
import { ErrorOptions } from "./ErrorOptions";
import { ESToast } from "../toast";

export interface ESError extends IESManager {
  __init(...params: any[]): Promise<any>;

  addListener(listener: ESErrorListener): void;

  removeListener(listener: ESErrorListener): void;
}

export function createESError(): ESError {
  let opts: ErrorOptions = {};

  const listenerList: Array<ESErrorListener> = [];

  let toast: ESToast;

  function __init(...params: any[]): Promise<any> {
    toast = params[0];
    return Promise.resolve();
  }

  function init(options: ErrorOptions = {}): Promise<any> {
    opts = options;
    return Promise.resolve();
  }

  function addListener(listener: ESErrorListener): void {
    const index = listenerList.findIndex((l) => l === listener);
    if (index > -1) {
      return;
    }
    listenerList.push(listener);
  }

  function removeListener(listener: ESErrorListener): void {
    const index = listenerList.findIndex((l) => l === listener);
    if (index > -1) {
      listenerList.splice(index, 1);
    }
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESErrorKey, instance);
      app.config.errorHandler = (err, instance, info) => {
        //
        listenerList.forEach((listener) => {
          try {
            listener.onError(err, instance, info);
          } catch (e) {}
        });

        //
        try {
          const message =
            opts.formatError?.(err) ?? (err instanceof Error ? err.message : String(err));

          if (opts.displayError) {
            opts.displayError(message, err, instance, info);
          } else {
            //
            if (process.env.NODE_ENV == "development") {
              console.error("❌ Vue Error:", err);
              console.error("👉 Component instance:", instance);
              console.error("⚠️ Info:", info);
              //
              toast.showToast(message + "\n" + info);
            }
          }
          try {
            opts.onError?.(err, instance, info);
          } catch (e) {}
        } catch (e) {
          console.error("🌋 Vue Error:", e);
        }
      };
    },
    __init,
    init,
    addListener,
    removeListener,
  };
}
