export enum RouterLogLevel {
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
}

export interface RouterLog {
  v(tag: string, ...args: any[]): void

  d(tag: string, ...args: any[]): void

  i(tag: string, ...args: any[]): void

  w(tag: string, ...args: any[]): void

  e(tag: string, ...args: any[]): void

  setMinimumLoggingLevel(level: RouterLogLevel): void

  isLoggable(level: RouterLogLevel): boolean
}

export function createRouterLog(): RouterLog {

  let _minimumLoggingLevel = RouterLogLevel.WARN


  function v(tag: string, ...args: any[]): void {
    if (isLoggable(RouterLogLevel.VERBOSE)) {
      console.log.apply(
        console,
        ['[Vue Router verbose]: '].concat(args) as [string, ...any[]]
      )
    }
  }

  function d(tag: string, ...args: any[]): void {
    if (isLoggable(RouterLogLevel.DEBUG)) {
      console.debug.apply(
        console,
        ['[Vue Router debug]: '].concat(args) as [string, ...any[]]
      )
    }
  }

  function i(tag: string, ...args: any[]): void {
    if (isLoggable(RouterLogLevel.INFO)) {
      console.info.apply(
        console,
        ['[Vue Router info]: '].concat(args) as [string, ...any[]]
      )
    }
  }

  function w(tag: string, ...args: any[]): void {
    if (isLoggable(RouterLogLevel.WARN)) {
      console.warn.apply(
        console,
        ['[Vue Router warn]: '].concat(args) as [string, ...any[]]
      )
    }
  }

  function e(tag: string, ...args: any[]): void {
    if (isLoggable(RouterLogLevel.ERROR)) {
      console.error.apply(
        console,
        ['[Vue Router error]: '].concat(args) as [string, ...any[]]
      )
    }
  }

  function setMinimumLoggingLevel(level: RouterLogLevel) {
    _minimumLoggingLevel = level;
  }

  function isLoggable(level: RouterLogLevel): boolean {
    return _minimumLoggingLevel <= level;
  }

  return {
    v,
    d,
    i,
    w,
    e,
    setMinimumLoggingLevel,
    isLoggable
  }
}
