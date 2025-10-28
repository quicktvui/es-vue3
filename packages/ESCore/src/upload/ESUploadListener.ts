export interface ESUploadListener {

  onUploadStart(): void

  onUploadSuccess(): void

  onUploadError(): void
}
