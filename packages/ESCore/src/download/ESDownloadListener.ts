import {ESDownloadInfo} from "./ESDownloadInfo";

export interface ESDownloadListener {

  onDownloadInit(download: ESDownloadInfo): void

  onDownloadStart(download: ESDownloadInfo): void

  onDownloadStop(download: ESDownloadInfo): void

  onDownloadCancel(download: ESDownloadInfo): void

  onDownloadSuccess(download: ESDownloadInfo): void

  onDownloadError(download: ESDownloadInfo): void

  onDownloadProgress(download: ESDownloadInfo, downloadSize: number, totalSize: number): void
}
