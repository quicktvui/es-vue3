import {IESManager} from "../core";
import {App} from "vue";
import {ESBroadcastKey} from "../useApi";
import {createESBroadcastModule, ESBroadcastModule} from "./ESBroadcastModule";
import {EventBus} from "@extscreen/es3-vue";
import {ESBroadcastReceiver} from "./ESBroadcastReceiver";
import {ESIntentFilter} from "./ESIntentFilter";

export interface ESBroadcast extends IESManager {

  registerReceiver(receiver: ESBroadcastReceiver, interFilter: ESIntentFilter): Promise<number>

  unregisterReceiver(receiver: ESBroadcastReceiver, interFilter: ESIntentFilter): Promise<number>

  sendBroadcast(paramsArray: Array<Array<any>>): Promise<boolean>
}

export function createESBroadcast(): ESBroadcast {

  const broadcastModule: ESBroadcastModule = createESBroadcastModule();
  const __broadcastReceiverSet = new Map<ESBroadcastReceiver, ESIntentFilter>();
  const __broadcastReceiverIdSet = new Map<ESBroadcastReceiver, number>();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function registerReceiver(receiver, interFilter): Promise<number> {
    let has = __broadcastReceiverSet.has(receiver);
    if (has) {
      let receiverId = __broadcastReceiverIdSet.get(receiver);
      if (receiverId !== undefined) {
        return Promise.resolve(receiverId);
      }
      return Promise.reject(-1);
    }
    return broadcastModule.registerReceiver(interFilter)
      .then((receiverId) => {
        if (receiverId >= 0) {
          __broadcastReceiverIdSet.set(receiver, receiverId);
          __broadcastReceiverSet.set(receiver, interFilter);
          return Promise.resolve(receiverId);
        }
        return Promise.reject();
      });
  }

  function unregisterReceiver(receiver, interFilter): Promise<number> {
    let has = __broadcastReceiverSet.has(receiver);
    if (!has) {
      return Promise.reject(-1);
    }
    const receiverId = __broadcastReceiverIdSet.get(receiver)
    if (receiverId == undefined || receiverId < 0) {
      return Promise.reject(-1);
    }
    return broadcastModule.unregisterReceiver(receiverId!)
      .then((receiverId) => {
        if (receiverId >= 0) {
          __broadcastReceiverSet.delete(receiver);
          __broadcastReceiverSet.delete(receiver)
          return Promise.resolve(receiverId);
        }
        return Promise.reject();
      });
  }

  function sendBroadcast(paramsArray: Array<Array<any>>): Promise<boolean> {
    return broadcastModule.sendBroadcast(paramsArray)
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESBroadcastKey, instance)
      EventBus.$on('onESBroadcastReceive', (intent) => {
        if (!__broadcastReceiverSet || __broadcastReceiverSet.size <= 0) {
          return;
        }
        let action = intent.action;
        __broadcastReceiverSet.forEach(function (value, key) {
          if (value && value.action && value.action.length > 0) {
            for (let i = 0; i < value.action.length; i++) {
              let a = value.action[i];
              if (a === action) {
                key.onReceive(intent);
              }
            }
          }
        });
      });
    },
    init,
    registerReceiver,
    unregisterReceiver,
    sendBroadcast,
  }
}
