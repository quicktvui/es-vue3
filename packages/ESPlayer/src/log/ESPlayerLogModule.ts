import {Native} from '@extscreen/es3-vue';

export interface ESPlayerLogModule {
  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void
}

export function createESPlayerLogModule(): ESPlayerLogModule {
  function v(tag: string, ...args: any[]): void {
    Native.callNative('ESLogModule', 'v', tag, args.toString());
  }

  function d(tag: string, ...args: any[]): void {
    Native.callNative('ESLogModule', 'd', tag, args.toString());
  }

  function i(tag: string, ...args: any[]): void {
    Native.callNative('ESLogModule', 'i', tag, args.toString());
  }

  function w(tag: string, ...args: any[]): void {
    Native.callNative('ESLogModule', 'w', tag, args.toString());
  }

  function e(tag: string, ...args: any[]): void {
    Native.callNative('ESLogModule', 'e', tag, args.toString());
  }

  return {
    v,
    d,
    i,
    w,
    e
  }
}
