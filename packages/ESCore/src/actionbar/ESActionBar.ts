import {App} from "vue";
import {ESActionBarKey} from "../useApi";
import {createESActionBarModule, ESActionBarModule} from "./ESActionBarModule";
import {IESManager} from "../core";

export interface ESActionBar extends IESManager {

  show(): void

  dismiss(): void

  isShowing(): Promise<boolean>
}

export function createESActionBar(): ESActionBar {

  const actionBar: ESActionBarModule = createESActionBarModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function show() {
    actionBar.show()
  }

  function dismiss() {
    actionBar.dismiss()
  }

  function isShowing() {
    return actionBar.isShowing()
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESActionBarKey, instance)
    },
    init,
    show,
    dismiss,
    isShowing
  }
}
