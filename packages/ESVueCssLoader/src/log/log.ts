export function info(msg: string, ..._args: any[]): void;
export function info(msg: string): void {
  if (!enableLog) return;
  const args = Array.from(arguments).slice(1);
  console.info.apply(console, ["[CssLoader info]: " + msg].concat(args) as [string, ...any[]]);
}

//
export function warn(msg: string, ..._args: any[]): void;
export function warn(msg: string): void {
  if (!enableLog) return;
  const args = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[CssLoader warn]: " + msg].concat(args) as [string, ...any[]]);
}

//
export function error(msg: string, ..._args: any[]): void;
export function error(msg: string): void {
  if (!enableLog) return;
  const args = Array.from(arguments).slice(1);
  console.error.apply(console, ["[CssLoader error]: " + msg].concat(args) as [string, ...any[]]);
}

//--------------------------------------------------
let enableLog = false;

export function setLoggerDebug(enabled: boolean) {
  enableLog = enabled;
}
