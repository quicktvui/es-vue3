import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESIntentFilter} from "./ESIntentFilter";

export interface ESBroadcastModule extends IESModule {

  registerReceiver(interFilter: ESIntentFilter): Promise<number>

  unregisterReceiver(receiverId: number): Promise<number>

  sendBroadcast(paramsArray: Array<Array<any>>): Promise<boolean>
}

export function createESBroadcastModule(): ESBroadcastModule {
  function registerReceiver(interFilter) {
    return Native.callNativeWithPromise('ESBroadcastModule', 'registerReceiver', interFilter);
  }

  function unregisterReceiver(receiverId) {
    return Native.callNativeWithPromise('ESBroadcastModule', 'unregisterReceiver', receiverId);
  }

  function sendBroadcast(paramsArray) {
    return Native.callNativeWithPromise('EsNativeModule', 'sendBroadcast', paramsArray);
  }

  return {
    registerReceiver,
    unregisterReceiver,
    sendBroadcast
  }
}
