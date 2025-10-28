import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESToastModule extends IESModule {

  showToast(message: string): void

  showLongToast(message: string): void

  showShortToast(message: string): void
}


export function createESToastModule(): ESToastModule {

  function showToast(message) {
    Native.callNative('ESToastModule', 'showToast', message);
  }

  function showLongToast(message) {
    Native.callNative('ESToastModule', 'showLongToast', message);
  }

  function showShortToast(message) {
    Native.callNative('ESToastModule', 'showShortToast', message);
  }

  return {
    showToast,
    showLongToast,
    showShortToast,
  }
}

