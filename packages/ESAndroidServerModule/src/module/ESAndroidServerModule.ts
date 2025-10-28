import { Native } from "@extscreen/es3-vue";
import { IESModule } from "@extscreen/es3-core";

export interface ESAndroidServerModule extends IESModule {
  startServer(): Promise<any>;

  stopServer(): Promise<any>;

  getServer(): Promise<any>;

  getTransferFiles(): Promise<any>;
}

export function createESAndroidHttpServerModule(): ESAndroidServerModule {
  function startServer() {
    return Native.callNativeWithPromise("ESAndroidServerModule", "startServer");
  }

  function stopServer() {
    return Native.callNativeWithPromise("ESAndroidServerModule", "stopServer");
  }

  function getServer() {
    return Native.callNativeWithPromise("ESAndroidServerModule", "getServer");
  }

  function getTransferFiles() {
    return Native.callNativeWithPromise("ESAndroidServerModule", "getTransferFiles");
  }

  return {
    startServer,
    stopServer,
    getServer,
    getTransferFiles,
  };
}
