//

export interface ESLogUploadInfo {
  readonly id: string
  readonly url: string
  readonly mediaType: string
  readonly filePramsKey: string
  readonly filePath: string
  readonly fileType: number
  params?: Map<string, string>
  errorMsg?: string
}
