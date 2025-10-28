export default interface SetInitListenerBase {
  setOnMergeConfigStart(listener: () => void): void

  setOnMergeConfigFinish(listener: (data: string) => void): void

  setOnGetNetConfigError(listener: (data: { errorCode: number, errorMessage: string }) => void): void

  setOnSoLoadStart(listener: (data: boolean) => void): void

  setOnSoLoadFinish(listener: (data: boolean) => void): void

  setOnSoLoadFail(listener: (data: { isDynamic: boolean, errorCode: number, errorMessage: string }) => void): void

  setOnInitComplete(listener: () => void): void

  setOnInitRepeat(listener: () => void): void
}
