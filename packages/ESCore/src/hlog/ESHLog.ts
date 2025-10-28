import { createESHLogModule, ESHLogModule } from "./ESHLogModule";
import { App } from "vue";
import { ESHLogKey } from "../useApi";
import { IESManager } from "../core";
import { createESLogListener, ESHLogListener } from "./ESLogListener";
import { createLogPluginHelper, LogPluginHelper } from "./LogPluginHelper";

export enum ESHLogLevel {
  LEVEL_VERBOSE = 0,
  LEVEL_DEBUG = 1,
  LEVEL_INFO = 2,
  LEVEL_WARN = 3,
  LEVEL_ERROR = 4,
}

export enum ESHLogType {
  LOG_TYPE_X_LOG = 0,
  LOG_TYPE_LOG_AN = 1,
}

export interface ESHLog extends IESManager, ESHLogListener {
  setBaseUrl(url: string): void;

  setUserId(id: string): void;

  initLog(): Promise<null>;

  v(tag: string, ...args: any[]): void;

  d(tag: string, ...args: any[]): void;

  i(tag: string, ...args: any[]): void;

  w(tag: string, ...args: any[]): void;

  e(tag: string, ...args: any[]): void;

  flush(): void;

  upLoad(dates: string[]): void;

  detectTask(): void;

  getSendFilePath(dates: string[]): Promise<string[]>;

  getAllFileInfo(): Promise<string[]>;

  getVersion(): Promise<string>;

  setLogLevel(level: ESHLogLevel): void;

  setLogType(type: ESHLogType): void;

  enableConsoleLogging(enable: boolean): void;

  enableNativeLogging(enable: boolean): void;

  isLoggable(level: ESHLogLevel): boolean;

  install(app: App): void;

  destroyLog(): void;

  getModuleName(): string;

  getPluginName(): string;
}

export function createESHLog(): ESHLog {
  let logLevel = ESHLogLevel.LEVEL_INFO;
  let logType = ESHLogType.LOG_TYPE_X_LOG;
  const logModule: ESHLogModule = createESHLogModule();
  const logListener: ESHLogListener = createESLogListener();
  const pluginHelper: LogPluginHelper = createLogPluginHelper();

  let isConsoleLoggingEnabled: boolean = true;
  let isNativeLoggingEnabled: boolean = true;

  let baseUrl = "";
  let uid = "";
  let hadInit = false;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function setBaseUrl(url: string): void {
    baseUrl = url;
  }

  function setUserId(id: string): void {
    uid = id;
    if (hadInit) logModule.setUserId(id);
  }

  function initLog(suffix: string = ""): Promise<null> {
    logListener.initListener();
    return new Promise((resolve, reject) => {
      pluginHelper.isHLogModuleRegistered().then((res) => {
        if (res) {
          resolve(null);
          if (uid) logModule.setUserId(uid);
          hadInit = true;
        } else {
          let pluginName = getPluginName() + (suffix ? `.${suffix}` : "");
          pluginHelper
            .installHLogPlugin(pluginName)
            .then(() => {
              if (uid) logModule.setUserId(uid);
              hadInit = true;
              logModule
                .initLog(logType, logLevel, baseUrl)
                .then(() => resolve(null))
                .catch((err) => reject(err));
            })
            .catch((e) => {
              reject(e);
            });
        }
      });
    });
  }

  function v(tag: string, ...args: any[]): void {
    if (isLoggable(ESHLogLevel.LEVEL_VERBOSE)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.v(tag, getArgsStr(args));
      }
    }
  }

  function d(tag: string, ...args: any[]): void {
    if (isLoggable(ESHLogLevel.LEVEL_DEBUG)) {
      if (isConsoleLoggingEnabled) {
        console.log(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.d(tag, getArgsStr(args));
      }
    }
  }

  function i(tag: string, ...args: any[]): void {
    if (isLoggable(ESHLogLevel.LEVEL_INFO)) {
      if (isConsoleLoggingEnabled) {
        console.info(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.i(tag, getArgsStr(args));
      }
    }
  }

  function w(tag: string, ...args: any[]): void {
    if (isLoggable(ESHLogLevel.LEVEL_WARN)) {
      if (isConsoleLoggingEnabled) {
        console.warn(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.w(tag, getArgsStr(args));
      }
    }
  }

  function e(tag: string, ...args: any[]): void {
    if (isLoggable(ESHLogLevel.LEVEL_ERROR)) {
      if (isConsoleLoggingEnabled) {
        console.error(tag, ...args);
      }
      if (isNativeLoggingEnabled) {
        logModule.e(tag, getArgsStr(args));
      }
    }
  }

  function flush() {
    logModule.flush();
  }

  function upLoad(dates: string[]): void {
    logModule.upLoad(dates);
  }

  function detectTask(): void {
    logModule.detectTask();
  }

  function getSendFilePath(dates: string[]): Promise<string[]> {
    return logModule.getSendFilePath(dates);
  }

  function getAllFileInfo(): Promise<string[]> {
    return logModule.getAllFileInfo();
  }

  function getVersion(): Promise<string> {
    return logModule.getVersion();
  }

  function setLogType(type: ESHLogType) {
    logType = type;
  }

  function setLogLevel(level: ESHLogLevel) {
    logLevel = level;
    logModule.setLevel(level);
  }

  function isLoggable(level: ESHLogLevel): boolean {
    return logLevel <= level;
  }

  function enableConsoleLogging(enable: boolean): void {
    isConsoleLoggingEnabled = enable;
  }

  function enableNativeLogging(enable: boolean): void {
    isNativeLoggingEnabled = enable;
  }

  function destroyLog(): void {
    logListener.destroyListener();
  }

  function getArgsStr(...args: any[]): string {
    if (!args || args.length === 0) return "";
    return args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");
  }

  function getModuleName(): string {
    return "eskit.sdk.support.log.hlog.ESHLogModule";
  }

  function getPluginName(): string {
    return "eskit.plugin.log.hlog";
  }

  return {
    install: function (app: App) {
      const logger = this;
      app.provide(ESHLogKey, logger);
    },
    init,
    setBaseUrl,
    setUserId,
    initLog,
    v,
    d,
    i,
    w,
    e,
    flush,
    upLoad,
    detectTask,
    getSendFilePath,
    getAllFileInfo,
    getVersion,
    setLogLevel,
    setLogType,
    enableConsoleLogging,
    enableNativeLogging,
    isLoggable,
    ...logListener,
    destroyLog,
    getModuleName,
    getPluginName,
  };
}
