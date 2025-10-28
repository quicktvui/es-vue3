import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESServiceModule extends IESModule {

  startService(paramsArray: Array<Array<string | number | boolean>>): void

}

export function createESServiceModule(): ESServiceModule {

  function startService(paramsArray) {
    Native.callNative('EsNativeModule', 'startService', paramsArray);
  }

  return {
    startService
  }
}
