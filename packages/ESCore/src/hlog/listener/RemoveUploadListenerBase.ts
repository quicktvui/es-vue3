export default interface RemoveUploadListenerBase {
  removeDetectTaskSuccessListener(): void

  removeDetectTaskErrorListener(): void

  removeStartListener(): void

  removeCancelListener(): void

  removeCancelSuccessListener(): void

  removeCancelErrorListener(): void

  removeCompleteListener(): void

  removeFailListener(): void

  removeItemStartListener(): void

  removeItemProgressListener(): void

  removeItemSuccessListener(): void

  removeItemFailListener(): void

  removeItemPostSuccessListener(): void

  removeItemPostFailListener(): void
}
