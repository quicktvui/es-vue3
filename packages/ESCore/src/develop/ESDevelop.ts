import {IESManager} from "../core";
import {App} from "vue";
import {ESDevelopKey} from "../useApi";
import {createESDevelopModule} from "./ESDevelopModule";
import {ESDevelopInfo} from "./ESDevelopInfo";

export interface ESDevelop extends IESManager {

  getDevelop(): ESDevelopInfo

  getPackageName(): string

  getVersionName(): string

  getVersionCode(): number

  getChannel(): string
}

export function createESDevelop(): ESDevelop {

  let develop: ESDevelopInfo

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      createESDevelopModule().getDevelop()
        .then(
          (result) => {
            develop = result;
            resolve(result);
          },
          error => {
            resolve(error);
          }
        );
    });
  }

  function getDevelop(): ESDevelopInfo {
    return develop;
  }

  function getPackageName(): string {
    return develop.packageName
  }

  function getVersionName(): string {
    return develop.versionName
  }

  function getVersionCode(): number {
    return develop.versionCode
  }

  function getChannel(): string {
    return develop.channel
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESDevelopKey, instance)
    },
    init,
    getDevelop,
    getPackageName,
    getVersionName,
    getVersionCode,
    getChannel
  }
}
