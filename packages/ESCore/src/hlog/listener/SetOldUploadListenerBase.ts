export default interface SetOldUploadListenerBase {

  setOnOldStartListener(listener: (data: string) => void): void

  setOnOldCancelListener(listener: () => void): void

  setOnOldCompleteListener(listener: () => void): void

  setOnOldFailListener(listener: (data: { errCode: number, errMsg: string }) => void): void

  setOnOldItemStartListener(listener: (data: { index: number, path: string }) => void): void

  setOnOldItemProgressListener(listener: (data: { index: number, percent: number }) => void): void

  setOnOldItemSuccessListener(listener: (data: number) => void): void

  setOnOldItemFailListener(listener: (data: { index: number, errorCode: number, errorMessage: string }) => void): void

  setOnOldItemPostSuccessListener(listener: (data: number) => void): void

  setOnOldItemPostFailListener(listener: (data: number) => void): void
}
