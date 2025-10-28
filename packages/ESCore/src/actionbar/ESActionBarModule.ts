import {Native} from "@extscreen/es3-vue";
import {IESModule} from "../core";

export interface ESActionBarModule extends IESModule {

  show(): void

  dismiss(): void

  isShowing(): Promise<boolean>
}


export function createESActionBarModule(): ESActionBarModule {

  function show() {
    Native.callNative('ESTopbarModule', 'show');
  }

  function dismiss() {
    Native.callNative('ESTopbarModule', 'dismiss');
  }

  function isShowing() {
    return Native.callNativeWithPromise('ESTopbarModule', 'isShown');
  }

  return {
    show,
    dismiss,
    isShowing
  }
}
