/**
 * 应用信息
 */
export interface ESAppInfo {
  readonly name: string
  readonly pkg: string
  readonly verCode?: number
  readonly verName?: string
  readonly installTime?: number
  readonly updateTime?: number
  readonly isSystemApp: boolean
}
