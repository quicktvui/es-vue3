import {EventBus} from "@extscreen/es3-vue";
import {IESManager} from "../core";
import {App} from "vue";
import {ESLogUploadKey} from "../useApi";
import {ESLogUploadInfo} from "./ESLogUploadInfo";
import {ESLogUploadListener} from "./ESLogUploadListener";
import {createESXLogModule, ESXLogModule} from "./ESXLogModule";

export interface ESLogUpload extends IESManager {

  upload(info: ESLogUploadInfo): void

  addListener(info: ESLogUploadInfo, listener: ESLogUploadListener): void

  removeListener(listener: ESLogUploadListener): void
}

export function createESLogUpload(): ESLogUpload {

  const logUploadModule: ESXLogModule = createESXLogModule()
  const listerMap = new Map<ESLogUploadListener, ESLogUploadInfo>()

  function addListener(info: ESLogUploadInfo, listener: ESLogUploadListener) {
    const has = listerMap.has(listener)
    if (has) {
      return;
    }
    listerMap.set(listener, info)
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

  function upload(info: ESLogUploadInfo): void {
    if (!info.params) {
      info.params = new Map<string, string>()
    }
    info.params.set('id', info.id)
    logUploadModule.upload(info)
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESLogUploadKey, instance)
      EventBus.$on('onESLogUploadStart', (params: ESLogUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onLogUploadStart()
            } catch (e) {
            }
          }
        });
      });
      EventBus.$on('onESLogUploadSuccess', (params: ESLogUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onLogUploadSuccess()
            } catch (e) {
            }
          }
        });
      });
      EventBus.$on('onESLogUploadError', (params: ESLogUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onLogUploadError(params.errorMsg)
            } catch (e) {
            }
          }
        });
      });
    },
    init,
    upload,
    addListener,
    removeListener
  }
}
