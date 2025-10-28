export interface OnUploadListenerBase {
  onDetectTaskSuccessListener: (data: { needUpLoad: boolean, dates: string }) => void

  onDetectTaskErrorListener: (data: { errCode: number, errMsg: string }) => void

  onStartListener: (data: string) => void

  onCancelListener: () => void

  onCancelSuccessListener: () => void

  onCancelErrorListener: (data: { errCode: number, errMsg: string }) => void

  onCompleteListener: () => void

  onFailListener: (data: { errCode: number, errMsg: string }) => void

  onItemStartListener: (data: { index: number, path: string }) => void

  onItemProgressListener: (data: { index: number, percent: number }) => void

  onItemSuccessListener: (data: number) => void

  onItemFailListener: (data: { index: number, errorCode: number, errorMessage: string }) => void

  onItemPostSuccessListener: (data: number) => void

  onItemPostFailListener: (data: number) => void
}
