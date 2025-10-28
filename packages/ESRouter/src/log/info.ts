export function info(msg: string, ..._args: any[]): void
export function info(msg: string): void {
  // avoid using ...args as it breaks in older Edge builds
  const args = Array.from(arguments).slice(1)
  console.info.apply(
    console,
    ['[Vue Router info]: ' + msg].concat(args) as [string, ...any[]]
  )
}
