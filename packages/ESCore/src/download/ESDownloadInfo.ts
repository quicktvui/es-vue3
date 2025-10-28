//
import {ESDownloadParams} from "./ESDownloadParams";

export interface ESDownloadInfo {
  readonly id: number
  readonly fileName: string
  readonly fileMD5?: string
  readonly fileUrl: string
  readonly fileType?: string
  readonly fileLength?: number
  readonly downloadLength?: number
  readonly params?: ESDownloadParams
  filePath?: string
}
