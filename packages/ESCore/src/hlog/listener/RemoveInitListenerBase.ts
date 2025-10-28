export default interface RemoveInitListenerBase {
  removeMergeConfigStart(): void

  removeMergeConfigFinish(): void

  removeGetNetConfigError(): void

  removeSoLoadStart(): void

  removeSoLoadFinish(): void

  removeSoLoadFail(): void

  removeInitComplete(): void

  removeInitRepeat(): void
}
