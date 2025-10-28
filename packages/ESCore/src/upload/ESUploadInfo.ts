//

export interface ESUploadInfo {
  readonly id: string
  readonly url: string
  readonly mediaType: string
  readonly fileParamsKey: string
  readonly filePath: string
  params?: Map<string, string>
  header?: Map<string, string>
}
