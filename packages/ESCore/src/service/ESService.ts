import {IESManager} from "../core";
import {App} from "vue";
import {ESServiceKey} from "../useApi";
import {createESServiceModule, ESServiceModule} from "./ESServiceModule";

export interface ESService extends IESManager {

  startService(paramsArray: Array<Array<string | number | boolean>>): void

}

export function createESService(): ESService {

  const serviceModule: ESServiceModule = createESServiceModule();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function startService(paramsArray) {
    serviceModule.startService(paramsArray)
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESServiceKey, instance)
    },
    init,
    startService,
  }
}
