import {IESManager} from "../core";
import {App} from "vue";
import {ESDisplayKey} from "../useApi";
import {ESDevice} from "../device";

export interface ESDisplay extends IESManager {

  getDisplayScale(): number

  getDisplaySize(size: number): number

  getScreenWidth(): number

  getScreenHeight(): number
}

export function createESDisplay(): ESDisplay {

  let screenWidth = 1920;
  let screenHeight = 1080;
  let displayScale = 1;

  let device: ESDevice

  function init(...params: any[]): Promise<any> {
    device = params[0]
    return new Promise((resolve, reject) => {
      screenWidth = device.getScreenWidth()
      screenHeight = device.getScreenHeight()
      displayScale = screenHeight / 1080;
      resolve(true)
    });
  }

  function getDisplayScale() {
    return displayScale;
  }

  function getDisplaySize(size) {
    return displayScale * size;
  }

  function getScreenWidth() {
    return screenWidth;
  }

  function getScreenHeight() {
    return screenHeight;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESDisplayKey, instance)
    },
    init,
    getDisplayScale,
    getDisplaySize,
    getScreenWidth,
    getScreenHeight,
  }
}
