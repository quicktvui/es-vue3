import {IESManager} from "../core";
import {App} from "vue";
import {ESBrightnessKey} from "../useApi";
import {ESBrightnessInfo} from "./ESBrightnessInfo";
import {createESBrightnessModule, ESBrightnessModule} from "./ESBrightnessModule";

export interface ESBrightness extends IESManager {

  getScreenBrightness(): Promise<ESBrightnessInfo>

  getWindowBrightness(): Promise<ESBrightnessInfo>

  getScreenBrightnessMode(): Promise<ESBrightnessInfo>

  getMaxBrightness(): Promise<ESBrightnessInfo>

  changeWindowBrightness(brightness: number): void

  changeScreenBrightness(systemBrightness: number): void
}

export function createESBrightness(): ESBrightness {

  const brightnessModule: ESBrightnessModule = createESBrightnessModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function getScreenBrightness() {
    return brightnessModule.getScreenBrightness();
  }

  function getWindowBrightness() {
    return brightnessModule.getWindowBrightness();
  }

  function getScreenBrightnessMode() {
    return brightnessModule.getScreenBrightnessMode();
  }

  function getMaxBrightness() {
    return brightnessModule.getMaxBrightness();
  }

  function changeWindowBrightness(brightness) {
    return brightnessModule.changeWindowBrightness(brightness);
  }

  function changeScreenBrightness(systemBrightness) {
    return brightnessModule.changeScreenBrightness(systemBrightness);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESBrightnessKey, instance)
    },
    init,
    getScreenBrightness,
    getWindowBrightness,
    getScreenBrightnessMode,
    getMaxBrightness,
    changeWindowBrightness,
    changeScreenBrightness
  }
}
