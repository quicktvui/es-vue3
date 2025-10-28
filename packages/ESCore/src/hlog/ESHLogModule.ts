import { Native } from "@extscreen/es3-vue";
import { IESModule } from "../core";
import { ESHLogLevel, ESHLogType } from "./ESHLog";

export interface ESHLogModule extends IESModule {
  setUserId(id: string): void;

  initLog(type: ESHLogType, level: ESHLogLevel, baseUrl: string): Promise<null>;

  setLevel(level: number): void;

  v(tag: string, log: string): void;

  d(tag: string, log: string): void;

  i(tag: string, log: string): void;

  w(tag: string, log: string): void;

  e(tag: string, log: string): void;

  flush(): void;

  upLoad(dates: string[]): void;

  detectTask(): void;

  getSendFilePath(dates: string[]): Promise<string[]>;

  getAllFileInfo(): Promise<string[]>;

  getVersion(): Promise<string>;
}

export function createESHLogModule(): ESHLogModule {
  function setUserId(id: string): void {
    Native.callNative("ESHLogModule", "setUserId", id);
  }

  function initLog(type: ESHLogType, level: ESHLogLevel, baseUrl: string): Promise<null> {
    return Native.callNativeWithPromise("ESHLogModule", "initLog", type, level, baseUrl);
  }

  function setLevel(level: number): void {
    Native.callNative("ESHLogModule", "setLevel", level);
  }

  function v(tag: string, log: string): void {
    Native.callNative("ESHLogModule", "v", tag, log);
  }

  function d(tag: string, log: string): void {
    Native.callNative("ESHLogModule", "d", tag, log);
  }

  function i(tag: string, log: string): void {
    Native.callNative("ESHLogModule", "i", tag, log);
  }

  function w(tag: string, log: string): void {
    Native.callNative("ESHLogModule", "w", tag, log);
  }

  function e(tag: string, log: string): void {
    Native.callNative("ESHLogModule", "e", tag, log);
  }

  function flush(): void {
    Native.callNative("ESHLogModule", "flush");
  }

  function upLoad(dates: string[]): void {
    Native.callNative("ESHLogModule", "upLoad", dates);
  }

  function detectTask(): void {
    Native.callNative("ESHLogModule", "detectTask");
  }

  function getSendFilePath(dates: string[]): Promise<string[]> {
    return Native.callNativeWithPromise("ESHLogModule", "getSendFilePath", dates);
  }

  function getAllFileInfo(): Promise<string[]> {
    return Native.callNativeWithPromise("ESHLogModule", "getAllFileInfo");
  }

  function getVersion(): Promise<string> {
    return Native.callNativeWithPromise("ESHLogModule", "getVersion");
  }

  return {
    setUserId,
    initLog,
    setLevel,
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
  };
}
