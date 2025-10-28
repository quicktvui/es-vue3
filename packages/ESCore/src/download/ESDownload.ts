import {IESManager} from "../core";
import {App} from "vue";
import {ESDownloadKey} from "../useApi";
import {ESDownloadInfo} from "./ESDownloadInfo";
import {createESDownloadModule, ESDownloadModule} from "./ESDownloadModule";
import {EventBus} from "@extscreen/es3-vue";
import {ESDownloadListener} from "./ESDownloadListener";
import {ESDownloadStatus} from "./ESDownloadStatus";

export interface ESDownload extends IESManager {

  initDownload(): void

  initDownloadPath(downloadCacheDir: string, interpolator: number): void

  download(download: ESDownloadInfo): void

  start(download: ESDownloadInfo): void

  stop(download: ESDownloadInfo): void

  cancel(download: ESDownloadInfo): void

  release(): void

  addListener(download: ESDownloadInfo, listener: ESDownloadListener): void

  removeListener(listener: ESDownloadListener): void
}

export function createESDownload(): ESDownload {

  const downloadModule: ESDownloadModule = createESDownloadModule()

  const listerMap = new Map<ESDownloadListener, ESDownloadInfo>()

  function addListener(download: ESDownloadInfo, listener) {
    const has = listerMap.has(listener)
    if (has) {
      return;
    }
    listerMap.set(listener, download)
  }

  function removeListener(listener) {
    const has = listerMap.has(listener)
    if (!has) {
      return;
    }
    listerMap.delete(listener)
  }

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function initDownload() {
    downloadModule.initDownload()
  }

  function initDownloadPath(downloadCacheDir, interpolator) {
    downloadModule.initDownloadPath(downloadCacheDir, interpolator)
  }

  function download(download) {
    downloadModule.download(download)
  }

  function start(download) {
    downloadModule.start(download)
  }

  function stop(download) {
    downloadModule.stop(download)
  }

  function cancel(download) {
    downloadModule.cancel(download)
  }

  function release() {
    downloadModule.release()
  }


  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESDownloadKey, instance)
      EventBus.$on('onDownloadStatusChanged', (status: ESDownloadStatus) => {
        let download = status.download;
        switch (status.state) {
          case 0:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadInit(download)
                } catch (e) {
                }
              }
            });
            break;
          case 1:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadStart(download)
                } catch (e) {
                }
              }
            });
            break;
          case 2:
            let downloadSize = status.downloadSize;
            let totalSize = status.totalSize;
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadProgress(download, downloadSize!, totalSize!)
                } catch (e) {
                }
              }
            });

            break;
          case 3:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadStop(download)
                } catch (e) {
                }
              }
            });
            break;
          case 4:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadCancel(download)
                } catch (e) {
                }
              }
            });
            break;
          case 5:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadSuccess(download)
                } catch (e) {
                }
              }
            });
            break;
          case 6:
            listerMap.forEach(function (info, listener) {
              if (info && info.id == download.id) {
                try {
                  listener.onDownloadError(download)
                } catch (e) {
                }
              }
            });
            break;
          default:
            break;
        }
      });
    },
    init,
    initDownload,
    initDownloadPath,
    download,
    start,
    stop,
    cancel,
    release,
    addListener,
    removeListener
  }
}
