import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESDevelopInfo} from "./ESDevelopInfo";

export interface ESDevelopModule extends IESModule {

  getDevelop(): Promise<ESDevelopInfo>

  getPackageName(): Promise<string>

  getVersionName(): Promise<string>

  getVersionCode(): Promise<number>

  getChannel(): Promise<string>
}


export function createESDevelopModule(): ESDevelopModule {

  function getDevelop() {
    return Native.callNativeWithPromise('AndroidDevelopModule', 'getDevelop');
  }

  function getPackageName() {
    return Native.callNativeWithPromise('AndroidDevelopModule', 'getPackageName');
  }

  function getVersionName() {
    return Native.callNativeWithPromise('AndroidDevelopModule', 'getVersionName');
  }

  function getVersionCode() {
    return Native.callNativeWithPromise('AndroidDevelopModule', 'getVersionCode');
  }

  function getChannel() {
    return Native.callNativeWithPromise('AndroidDevelopModule', 'getChannel');
  }

  return {
    getDevelop,
    getPackageName,
    getVersionName,
    getVersionCode,
    getChannel,
  }
}
