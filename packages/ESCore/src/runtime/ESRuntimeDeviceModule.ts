import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESRuntimeDeviceInfo {
  deviceId: string
  deviceType: string
}

export interface ESRuntimeDeviceModule extends IESModule {

  getRuntimeDeviceInfo(): Promise<ESRuntimeDeviceInfo>;

  getRuntimeDeviceId(): Promise<string>

  getRuntimeDeviceType(): Promise<string>
}

export function createESRuntimeDeviceModule(): ESRuntimeDeviceModule {

  function getRuntimeDeviceInfo() {
    return Native.callNativeWithPromise('RuntimeDeviceModule',
      'getRuntimeDeviceInfo');
  }

  function getRuntimeDeviceId() {
    return Native.callNativeWithPromise('RuntimeDeviceModule',
      'getRuntimeDeviceId');
  }

  function getRuntimeDeviceType() {
    return Native.callNativeWithPromise('RuntimeDeviceModule',
      'getRuntimeDeviceType');
  }

  return {
    getRuntimeDeviceInfo,
    getRuntimeDeviceId,
    getRuntimeDeviceType,
  }
}

export function createESRuntimeDevicePluginModule(): ESRuntimeDeviceModule {

  function getRuntimeDeviceInfo() {
    return Native.callNativeWithPromise('ESRuntimeDeviceModule',
      'getRuntimeDeviceInfo');
  }

  function getRuntimeDeviceId() {
    return Native.callNativeWithPromise('ESRuntimeDeviceModule',
      'getRuntimeDeviceId');
  }

  function getRuntimeDeviceType() {
    return Native.callNativeWithPromise('ESRuntimeDeviceModule',
      'getRuntimeDeviceType');
  }

  return {
    getRuntimeDeviceInfo,
    getRuntimeDeviceId,
    getRuntimeDeviceType,
  }
}
