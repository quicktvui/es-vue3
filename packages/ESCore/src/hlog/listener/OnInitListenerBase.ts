export interface OnInitListenerBase {
  onMergeConfigStart: () => void

  onMergeConfigFinish: (data: string) => void

  onGetNetConfigError: (data: { errorCode: number, errorMessage: string }) => void

  onSoLoadStart: (data: boolean) => void

  onSoLoadFinish: (data: boolean) => void

  onSoLoadFail: (data: { isDynamic: boolean, errorCode: number, errorMessage: string }) => void

  onInitComplete: () => void

  onInitRepeat: () => void
}
