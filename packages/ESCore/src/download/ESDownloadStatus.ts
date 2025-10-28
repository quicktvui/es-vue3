import {ESDownloadState} from "./ESDownloadState";
import {ESDownloadInfo} from "./ESDownloadInfo";

export interface ESDownloadStatus {
  readonly state: ESDownloadState
  readonly download: ESDownloadInfo
  readonly code?: number
  readonly message?: string
  readonly downloadSize?: number
  readonly totalSize?: number
}
