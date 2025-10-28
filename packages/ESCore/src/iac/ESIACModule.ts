import {Native} from "@extscreen/es3-vue";
import {ESIACMessage} from "./ESIACMessage";

/**
 *
 */
export interface ESIACModule {
  sendMessage(message: ESIACMessage): Promise<boolean>
}


export function createESIACModule(): ESIACModule {

  function sendMessage(message: ESIACMessage) {
    return Native.callNativeWithPromise('ESModule', 'sendESNativeMapEventAll',
      '51C16B03BB8CCDEB4CA302D15FA2B9DC', message);
  }

  return {
    sendMessage,
  }
}
