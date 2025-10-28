/**
 * ES SDK 信息
 */
export interface ESSDKInfo {
  cid: string
  IPAddress: string
  deviceName: string
  readonly versionCode: number
  readonly versionName: string
  readonly packageName: string
  readonly eskit_ver_code: number
  readonly eskit_ver_name: string
  readonly miniProgramPath: string
  readonly runtimePath: string
  readonly schemes: Array<string>
  readonly sdkChannel?: string
}
