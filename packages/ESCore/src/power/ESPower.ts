import { IESManager } from "../core";
import { App } from "vue";
import { ESPowerKey } from "../useApi";
import { createESPowerModule, ESPowerModule } from "./ESPowerModule";

export interface ESPower extends IESManager {
  wakeLockAcquire(): Promise<boolean>;

  wakeLockRelease(): Promise<boolean>;
}

export function createESPower(): ESPower {
  const powerModule: ESPowerModule = createESPowerModule();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function wakeLockAcquire() {
    return powerModule.wakeLockAcquire();
  }

  function wakeLockRelease() {
    return powerModule.wakeLockRelease();
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESPowerKey, instance);
    },
    init,
    wakeLockAcquire,
    wakeLockRelease,
  };
}
