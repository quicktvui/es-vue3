import { App, reactive } from "vue";
import { IESManager } from "@extscreen/es3-core";
import ESErrorHandler from "../component/ESErrorHandler.vue";
import { ErrorHandlerOptions } from "./ErrorHandlerOptions";
import { ESErrorHandlerKey } from "../useApi";

export const errorState = reactive({
  visible: false,
  message: "",
});

export interface ESErrorHandler extends IESManager {}

export function createESErrorHandler(options: ErrorHandlerOptions = {}): ESErrorHandler {
  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }
  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESErrorHandlerKey, instance);
      //
      app.component("es-error-handler", ESErrorHandler);
      //
      app.config.errorHandler = (err, instance, info) => {
        const message =
          options.formatError?.(err) ?? (err instanceof Error ? err.message : String(err));

        console.error("#################################################");
        console.error("🌋 Vue ErrorHandler:", err);
        console.error("👉 Component instance:", instance);
        console.error("🧩 Info:", info);
        console.error("#################################################");

        if (options.showDialog !== false) {
          errorState.message = message + "\n" + info;
          errorState.visible = true;
        }
        options.onError?.(err, instance, info);
      };
    },
    init,
  };
}
