import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESPowerModule extends IESModule {

  wakeLockAcquire(): Promise<boolean>

  wakeLockRelease(): Promise<boolean>
}


export function createESPowerModule(): ESPowerModule {


  function wakeLockAcquire() {
    return Native.callNativeWithPromise('AndroidPowerModule',
      'wakeLockAcquire',);
  }

  function wakeLockRelease() {
    return Native.callNativeWithPromise('AndroidPowerModule',
      'wakeLockRelease',);
  }

  return {
    wakeLockAcquire,
    wakeLockRelease
  }
}

