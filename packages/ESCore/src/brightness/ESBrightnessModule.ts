import {IESModule} from "../core";
import {ESBrightnessInfo} from "./ESBrightnessInfo";
import {Native} from "@extscreen/es3-vue";

export interface ESBrightnessModule extends IESModule {

  getScreenBrightness(): Promise<ESBrightnessInfo>

  getWindowBrightness(): Promise<ESBrightnessInfo>

  getScreenBrightnessMode(): Promise<ESBrightnessInfo>

  getMaxBrightness(): Promise<ESBrightnessInfo>

  changeWindowBrightness(brightness: number): void

  changeScreenBrightness(systemBrightness: number): void
}

export function createESBrightnessModule(): ESBrightnessModule {

  function getScreenBrightness() {
    return Native.callNativeWithPromise('ESBrightnessModule', 'getScreenBrightness');
  }

  function getWindowBrightness() {
    return Native.callNativeWithPromise('ESBrightnessModule', 'getWindowBrightness');
  }

  function getScreenBrightnessMode() {
    return Native.callNativeWithPromise('ESBrightnessModule', 'getScreenBrightnessMode');
  }

  function getMaxBrightness() {
    return Native.callNativeWithPromise('ESBrightnessModule', 'getMaxBrightness');
  }

  function changeWindowBrightness(brightness) {
    return Native.callNative('ESBrightnessModule', 'changeWindowBrightness', brightness);
  }

  function changeScreenBrightness(systemBrightness) {
    return Native.callNative('ESBrightnessModule', 'changeScreenBrightness', systemBrightness);
  }

  return {
    getScreenBrightness,
    getWindowBrightness,
    getScreenBrightnessMode,
    getMaxBrightness,
    changeWindowBrightness,
    changeScreenBrightness,
  }
}
