export interface ESLogUploadListener {

  onLogUploadStart(): void

  onLogUploadSuccess(): void

  onLogUploadError(errorMsg?: string): void
}
