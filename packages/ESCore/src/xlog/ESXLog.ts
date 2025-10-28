import {createESXLogModule, ESXLogModule} from "./ESXLogModule";
import {App} from "vue";
import {ESXLogKey} from "../useApi";
import {IESManager} from "../core";

export enum ESXLogLevel {
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
}

export interface ESXLog extends IESManager {
  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void

  setMinimumLoggingLevel(level: ESXLogLevel): void

  isLoggable(level: ESXLogLevel): boolean

  install(app: App): void

  initXLogConsole(tag: boolean): void

  destroyLog(): void

  setConsoleLogOpen(isOpen: boolean): void

  hasXLogFile(): Promise<boolean>
}

export function createESXLog(): ESXLog {

  let _minimumLoggingLevel = ESXLogLevel.WARN
  const logModule: ESXLogModule = createESXLogModule();

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function v(tag: string, ...args: any[]): void {
    if (isLoggable(ESXLogLevel.VERBOSE)) {
      console.log(tag, ...args);
      logModule.v(tag, ...args);
    }
  }

  function d(tag: string, ...args: any[]): void {
    if (isLoggable(ESXLogLevel.DEBUG)) {
      console.log(tag, ...args);
      logModule.d(tag, ...args);
    }
  }

  function i(tag: string, ...args: any[]): void {
    if (isLoggable(ESXLogLevel.INFO)) {
      console.log(tag, ...args);
      logModule.i(tag, ...args);
    }
  }

  function w(tag: string, ...args: any[]): void {
    if (isLoggable(ESXLogLevel.WARN)) {
      console.log(tag, ...args);
      logModule.w(tag, ...args);
    }
  }

  function e(tag: string, ...args: any[]): void {
    if (isLoggable(ESXLogLevel.ERROR)) {
      console.log(tag, ...args);
      logModule.e(tag, ...args);
    }
  }

  function setMinimumLoggingLevel(level: ESXLogLevel) {
    _minimumLoggingLevel = level;
  }

  function isLoggable(level: ESXLogLevel): boolean {
    return _minimumLoggingLevel <= level;
  }

  function initXLogConsole(isOpen): void {
    logModule.initXLogConsole(isOpen)
  }

  function destroyLog() {
    logModule.destroyLog()
  }

  function setConsoleLogOpen(isOpen): void {
    logModule.setConsoleLogOpen(isOpen)
  }

  function hasXLogFile(): Promise<boolean> {
    return logModule.hasXLogFile()
  }

  return {
    install: function (app: App) {
      const logger = this
      app.provide(ESXLogKey, logger)
    },
    init,
    v,
    d,
    i,
    w,
    e,
    setMinimumLoggingLevel,
    isLoggable,
    initXLogConsole,
    destroyLog,
    setConsoleLogOpen,
    hasXLogFile
  }
}
