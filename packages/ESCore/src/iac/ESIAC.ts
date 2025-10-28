import { IESManager } from "../core";
import { App } from "vue";
import { ESInterApplicationCommunicationKey } from "../useApi";
import { createESIACModule } from "./ESIACModule";

import { ESIACMessage } from "./ESIACMessage";
import { ESIACReceiver } from "./ESIACReceiver";
import { ESIACMessageFilter } from "./ESIACMessageFilter";

import { EventBus } from "@extscreen/es3-vue";
import { ES } from "../es";
import { ESLog, ESLogLevel } from "../log";

export interface ESIAC extends IESManager {
  sendMessage(message: ESIACMessage): Promise<boolean>;

  registerReceiver(receiver: ESIACReceiver, messageFilter: ESIACMessageFilter): void;

  unregisterReceiver(receiver: ESIACReceiver): void;
}

export function createESIAC(): ESIAC {
  const TAG = "ESIAC";
  const interApplicationCommunicationModule = createESIACModule();
  const __messageReceiverSet = new Map<ESIACReceiver, ESIACMessageFilter>();

  let es: ES;
  let log: ESLog;

  function init(...params: any[]): Promise<any> {
    es = params[0];
    log = params[1];
    return Promise.resolve();
  }

  function sendMessage(imessage: ESIACMessage): Promise<boolean> {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-----sendMessage------->>>", imessage);
    }
    return interApplicationCommunicationModule.sendMessage(imessage);
  }

  function registerReceiver(receiver: ESIACReceiver, messageFilter: ESIACMessageFilter) {
    let has = __messageReceiverSet.has(receiver);
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-----registerReceiver------->>>", has, receiver, messageFilter);
    }
    if (!has) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----registerReceiver---set---receiver->>>", has, receiver, messageFilter);
      }
      __messageReceiverSet.set(receiver, messageFilter);
    }
  }

  function unregisterReceiver(receiver: ESIACReceiver) {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-----unregisterReceiver------->>>", receiver);
    }
    __messageReceiverSet.delete(receiver);
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESInterApplicationCommunicationKey, instance);
      //InterApplicationCommunication MD5
      EventBus.$on("51C16B03BB8CCDEB4CA302D15FA2B9DC", (message: ESIACMessage) => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, "-----onReceiveMessage------->>>", message);
        }
        if (!__messageReceiverSet || __messageReceiverSet.size <= 0) {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-----__messageReceiverSet is null!----->>>", __messageReceiverSet);
          }
          return;
        }
        const action = message.action;
        if (message.package && es.getESPackageName() != message.package) {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(
              TAG,
              "ESAppPackageName:" +
                es.getESPackageName() +
                "  messagePackageName:" +
                message.package,
            );
          }
          return;
        }
        __messageReceiverSet.forEach(function (value, key) {
          if (value && value.action && value.action.length > 0) {
            for (let i = 0; i < value.action.length; i++) {
              let a = value.action[i];
              if (a === action) {
                if (log.isLoggable(ESLogLevel.DEBUG)) {
                  log.d(TAG, "-----onReceiveMessage----onReceive--->>>", message);
                }
                key.onReceive(message);
              }
            }
          }
        });
      });
    },
    init,
    sendMessage,
    registerReceiver,
    unregisterReceiver,
  };
}
