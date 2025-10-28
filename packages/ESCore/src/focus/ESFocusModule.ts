import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESFocusable} from "./ESFocusable";

export interface ESFocusModule extends IESModule {

  requestFocusDirectly(focusable: ESFocusable)

  requestFocus(focusable: ESFocusable)

  blockFocus(focusable: ESFocusable)

  unblockFocus(focusable: ESFocusable)
}


export function createESFocusModule(): ESFocusModule {

  function requestFocusDirectly(focusable) {
    Native.callUIFunction(focusable, 'requestFocusDirectly', []);
  }

  function requestFocus(focusable) {
    Native.callUIFunction(focusable, 'requestFocus', []);
  }

  function blockFocus(focusable) {
    Native.callUIFunction(focusable, "blockRootFocus", [])
  }

  function unblockFocus(focusable) {
    Native.callUIFunction(focusable, "unBlockRootFocus", [])
  }

  return {
    requestFocusDirectly,
    requestFocus,
    blockFocus,
    unblockFocus
  }
}

