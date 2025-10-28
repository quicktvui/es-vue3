import {createESLogModule, ESLogModule} from "./ESLogModule";
import {App} from "vue";
import {ESLogKey} from "../useApi";
import {IESManager} from "../core";

export enum ESLogLevel {
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
}

export interface ESLog extends IESManager {
  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void

  setMinimumLoggingLevel(level: ESLogLevel): void

  enableConsoleLogging(enable: boolean): void

  enableNativeLogging(enable: boolean): void

  isLoggable(level: ESLogLevel): boolean

  install(app: App): void
}

export function createESLog(): ESLog {

  let _minimumLoggingLevel = ESLogLevel.WARN
  const logModule: ESLogModule = createESLogModule();

  let isConsoleLoggingEnabled: boolean = true
  let isNativeLoggingEnabled: boolean = true

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function v(tag: string, ...args: any[]): void {
    if (isLoggable(ESLogLevel.VERBOSE)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function d(tag: string, ...args: any[]): void {
    if (isLoggable(ESLogLevel.DEBUG)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function i(tag: string, ...args: any[]): void {
    if (isLoggable(ESLogLevel.INFO)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function w(tag: string, ...args: any[]): void {
    if (isLoggable(ESLogLevel.WARN)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function e(tag: string, ...args: any[]): void {
    if (isLoggable(ESLogLevel.ERROR)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, ...args);
      }
    }
  }

  function setMinimumLoggingLevel(level: ESLogLevel) {
    _minimumLoggingLevel = level;
  }

  function isLoggable(level: ESLogLevel): boolean {
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
      app.provide(ESLogKey, logger)
    },
    init,
    v,
    d,
    i,
    w,
    e,
    setMinimumLoggingLevel,
    enableConsoleLogging,
    enableNativeLogging,
    isLoggable
  }
}
