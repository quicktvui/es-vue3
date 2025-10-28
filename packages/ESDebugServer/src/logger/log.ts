//------------------------------------------------------------------
import {bold, green, red} from "colors/safe";

export function warn(msg: string, ..._args: any[]): void
export function warn(msg: string): void {
  const args = Array.from(arguments).slice(1)
  console.warn.apply(
    console,
    ['[ES Debug Server]: ' + msg].concat(args) as [string, ...any[]]
  )
}

//------------------------------------------------------------------
export function info(msg: string, ..._args: any[]): void
export function info(msg: string): void {
  const args = Array.from(arguments).slice(1)
  console.error.apply(
    console,
    [bold(red('[ES Debug Server]: ' + msg))].concat(args) as [string, ...any[]]
  )
}


//------------------------------------------------------------------
export function debug(msg: string, ..._args: any[]): void
export function debug(msg: string): void {
  const args = Array.from(arguments).slice(1)

  console.debug.apply(
    console,
    [bold(red('[ES Debug Server]: ' + msg))].concat(args) as [string, ...any[]]
  )
}


//------------------------------------------------------------------
export function error(msg: string, ..._args: any[]): void
export function error(msg: string): void {
  const args = Array.from(arguments).slice(1)
  console.error.apply(
    console,
    ['[ES Debug Server]: ' + msg].concat(args) as [string, ...any[]]
  )
}
