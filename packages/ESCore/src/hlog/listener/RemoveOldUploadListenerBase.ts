export default interface RemoveOldUploadListenerBase {

  removeOldStartListener(): void

  removeOldCancelListener(): void

  removeOldCompleteListener(): void

  removeOldFailListener(): void

  removeOldItemStartListener(): void

  removeOldItemProgressListener(): void

  removeOldItemSuccessListener(): void

  removeOldItemFailListener(): void

  removeOldItemPostSuccessListener(): void

  removeOldItemPostFailListener(): void
}
