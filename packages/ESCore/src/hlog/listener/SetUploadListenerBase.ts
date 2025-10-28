export default interface SetUploadListenerBase {
  setOnDetectTaskSuccessListener(listener: (data: { needUpLoad: boolean, dates: string }) => void): void

  setOnDetectTaskErrorListener(listener: (data: { errCode: number, errMsg: string }) => void): void

  setOnStartListener(listener: (data: string) => void): void

  setOnCancelListener(listener: () => void): void

  setOnCancelSuccessListener(listener: () => void): void

  setOnCancelErrorListener(listener: (data: { errCode: number, errMsg: string }) => void): void

  setOnCompleteListener(listener: () => void): void

  setOnFailListener(listener: (data: { errCode: number, errMsg: string }) => void): void

  setOnItemStartListener(listener: (data: { index: number, path: string }) => void): void

  setOnItemProgressListener(listener: (data: { index: number, percent: number }) => void): void

  setOnItemSuccessListener(listener: (data: number) => void): void

  setOnItemFailListener(listener: (data: { index: number, errorCode: number, errorMessage: string }) => void): void

  setOnItemPostSuccessListener(listener: (data: number) => void): void

  setOnItemPostFailListener(listener: (data: number) => void): void
}
