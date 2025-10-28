import {Native} from "@extscreen/es3-vue";
import {ESDownloadInfo} from "./ESDownloadInfo";
import {IESModule} from "../core";

export interface ESDownloadModule extends IESModule {

  initDownload(): void

  initDownloadPath(downloadCacheDir: string, interpolator: number): void

  download(download: ESDownloadInfo): void

  start(download: ESDownloadInfo): void

  stop(download: ESDownloadInfo): void

  cancel(download: ESDownloadInfo): void

  release(): void
}

export function createESDownloadModule(): ESDownloadModule {

  function initDownload() {
    Native.callNative('ESDownloadModule', 'initDefaultDownload');
  }

  function initDownloadPath(downloadCacheDir, interpolator) {
    Native.callNative('ESDownloadModule', 'initDownload', downloadCacheDir, interpolator);
  }

  function download(download) {
    Native.callNative('ESDownloadModule', 'download', download);
  }

  function start(download) {
    Native.callNative('ESDownloadModule', 'start', download);
  }

  function stop(download) {
    Native.callNative('ESDownloadModule', 'stop', download);
  }

  function cancel(download) {
    Native.callNative('ESDownloadModule', 'cancel', download);
  }

  function release() {
    Native.callNative('ESDownloadModule', 'release');
  }

  return {
    initDownload,
    initDownloadPath,
    download,
    start,
    stop,
    cancel,
    release
  }
}
