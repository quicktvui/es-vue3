import {IESManager} from "../core";
import {App} from "vue";
import {ESFocusKey} from "../useApi";
import {createESFocusModule, ESFocusModule} from "./ESFocusModule";
import {ESFocusable} from "./ESFocusable";

export interface ESFocus extends IESManager {

  requestFocusDirectly(focusable: ESFocusable)

  requestFocus(focusable: ESFocusable)

  blockFocus(focusable: ESFocusable)

  unblockFocus(focusable: ESFocusable)
}

export function createESFocus(): ESFocus {

  const focusModule: ESFocusModule = createESFocusModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function requestFocusDirectly(focusable) {
    focusModule.requestFocusDirectly(focusable);
  }

  function requestFocus(focusable) {
    focusModule.requestFocus(focusable);
  }

  function blockFocus(focusable) {
    focusModule.blockFocus(focusable);
  }

  function unblockFocus(focusable) {
    focusModule.unblockFocus(focusable);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESFocusKey, instance)
    },
    init,
    requestFocusDirectly,
    requestFocus,
    blockFocus,
    unblockFocus
  }
}
