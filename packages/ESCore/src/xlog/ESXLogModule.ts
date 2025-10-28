import {Native} from '@extscreen/es3-vue';
import {IESModule} from "../";
import {ESLogUploadInfo} from "./ESLogUploadInfo";

export interface ESXLogModule extends IESModule {

  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void

  initXLogConsole(tag: boolean): void

  upload(info: ESLogUploadInfo): void

  destroyLog(): void

  setConsoleLogOpen(isOpen: boolean): void

  hasXLogFile(): Promise<boolean>
}

export function createESXLogModule(): ESXLogModule {
  function v(tag: string, ...args: any[]): void {
    Native.callNative('ESXLogModule', 'v', tag, args.toString());
  }

  function d(tag: string, ...args: any[]): void {
    Native.callNative('ESXLogModule', 'd', tag, args.toString());
  }

  function i(tag: string, ...args: any[]): void {
    Native.callNative('ESXLogModule', 'i', tag, args.toString());
  }

  function w(tag: string, ...args: any[]): void {
    Native.callNative('ESXLogModule', 'w', tag, args.toString());
  }

  function e(tag: string, ...args: any[]): void {
    Native.callNative('ESXLogModule', 'e', tag, args.toString());
  }

  function initXLogConsole(tag: boolean): void {
    Native.callNative('ESXLogModule', 'initXlogConsole', tag);
  }

  function upload(info: ESLogUploadInfo) {
    Native.callNative('ESXLogModule', 'upload',
      info.url,
      info.mediaType,
      info.filePramsKey,
      info.fileType,
      info.params);
  }

  function destroyLog() {
    Native.callNative('ESXLogModule', 'destroyLog');
  }

  function setConsoleLogOpen(isOpen: boolean) {
    Native.callNative('ESXLogModule', 'setConsoleLogOpen', isOpen);
  }

  function hasXLogFile() {
    return Native.callNativeWithPromise('ESXLogModule', 'hasXlogFile');
  }

  return {
    v,
    d,
    i,
    w,
    e,
    initXLogConsole,
    upload,
    destroyLog,
    setConsoleLogOpen,
    hasXLogFile
  }
}
