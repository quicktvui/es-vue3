import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESNetworkInfo} from "./ESNetworkInfo";
import {ESWifiInfo} from "./ESWifiInfo";

export interface ESNetworkModule extends IESModule {

  getActiveNetworkInfo(): Promise<ESNetworkInfo>

  getWifiInfo(): Promise<ESWifiInfo>
}


export function createESNetworkModule(): ESNetworkModule {

  function getActiveNetworkInfo() {
    return Native.callNativeWithPromise('AndroidNetworkModule',
      'getActiveNetworkInfo');
  }

  function getWifiInfo() {
    return Native.callNativeWithPromise('AndroidNetworkModule',
      'getWifiInfo');
  }

  return {
    getActiveNetworkInfo,
    getWifiInfo
  }
}
