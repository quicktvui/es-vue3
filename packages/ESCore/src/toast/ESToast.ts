import {IESManager} from "../core";
import {App} from "vue";
import {ESToastKey} from "../useApi";
import {createESToastModule} from "./ESToastModule";

export interface ESToast extends IESManager {

  showToast(message: string): void

  showLongToast(message: string): void

  showShortToast(message: string): void
}

export function createESToast(): ESToast {

  const toastModule = createESToastModule();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function showToast(message) {
    toastModule.showToast(message);
  }

  function showLongToast(message) {
    toastModule.showLongToast(message);
  }

  function showShortToast(message) {
    toastModule.showShortToast(message);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESToastKey, instance)
    },
    init,
    showToast,
    showLongToast,
    showShortToast,
  }
}
