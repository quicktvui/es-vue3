import {createESPlayerLogModule, ESPlayerLogModule} from "./ESPlayerLogModule";
import {App} from "vue";
import {playerLogKey} from "../injectionSymbols";
import {ESIPlayerManager} from "../core/ESIPlayerManager";

export enum ESPlayerLogLevel {
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
}

export interface ESPlayerLog extends ESIPlayerManager {

  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void

  setMinimumLoggingLevel(level: ESPlayerLogLevel): void

  isLoggable(level: ESPlayerLogLevel): boolean

  enableConsoleLogging(enable: boolean): void

  enableNativeLogging(enable: boolean): void
}

export function createESPlayerLog(): ESPlayerLog {

  let _minimumLoggingLevel = ESPlayerLogLevel.WARN
  const logModule: ESPlayerLogModule = createESPlayerLogModule();

  let isConsoleLoggingEnabled: boolean = true
  let isNativeLoggingEnabled: boolean = true

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve) => {
      const debug = params[0] ?? false
      if (debug) {
        setMinimumLoggingLevel(ESPlayerLogLevel.VERBOSE);
      } else {
        setMinimumLoggingLevel(ESPlayerLogLevel.WARN);
      }
      resolve(true)
    });
  }

  function v(tag: string, ...args: any[]): void {
    if (isLoggable(ESPlayerLogLevel.VERBOSE)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.v(tag, ...args);
      }
    }
  }

  function d(tag: string, ...args: any[]): void {
    if (isLoggable(ESPlayerLogLevel.DEBUG)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.d(tag, ...args);
      }
    }
  }

  function i(tag: string, ...args: any[]): void {
    if (isLoggable(ESPlayerLogLevel.INFO)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.i(tag, ...args);
      }
    }
  }

  function w(tag: string, ...args: any[]): void {
    if (isLoggable(ESPlayerLogLevel.WARN)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.w(tag, ...args);
      }
    }
  }

  function e(tag: string, ...args: any[]): void {
    if (isLoggable(ESPlayerLogLevel.ERROR)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function setMinimumLoggingLevel(level: ESPlayerLogLevel) {
    _minimumLoggingLevel = level;
  }

  function isLoggable(level: ESPlayerLogLevel): boolean {
    return _minimumLoggingLevel <= level;
  }

  function enableConsoleLogging(enable: boolean): void {
    isConsoleLoggingEnabled = enable
  }

  function enableNativeLogging(enable: boolean): void {
    isNativeLoggingEnabled = enable
  }

  return {
    install: function (app: App) {
      const logger = this
      app.provide(playerLogKey, logger)
    },
    init,
    v,
    d,
    i,
    w,
    e,
    setMinimumLoggingLevel,
    isLoggable,
    enableConsoleLogging,
    enableNativeLogging,
  }
}
