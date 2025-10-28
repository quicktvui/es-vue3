import {EventBus} from "@extscreen/es3-vue";
import {IESManager} from "../core";
import {App} from "vue";
import {ESUploadKey} from "../useApi";
import {ESUploadInfo} from "./ESUploadInfo";
import {ESUploadListener} from "./ESUploadListener";
import {createESUploadModule, ESUploadModule} from "./ESUploadModule";

export interface ESUpload extends IESManager {

  upload(info: ESUploadInfo): void

  addListener(info: ESUploadInfo, listener: ESUploadListener): void

  removeListener(listener: ESUploadListener): void
}

export function createESUpload(): ESUpload {

  const uploadModule: ESUploadModule = createESUploadModule()
  const listerMap = new Map<ESUploadListener, ESUploadInfo>()

  function addListener(info: ESUploadInfo, listener) {
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

  function upload(info: ESUploadInfo): void {
    if (!info.params) {
      info.params = new Map<string, string>()
    }
    info.params.set('id', info.id)
    uploadModule.upload(info)
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESUploadKey, instance)
      EventBus.$on('onESUploadStart', (params: ESUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onUploadStart()
            } catch (e) {
            }
          }
        });
      });
      EventBus.$on('onESUploadSuccess', (params: ESUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onUploadSuccess()
            } catch (e) {
            }
          }
        });
      });
      EventBus.$on('onESUploadError', (params: ESUploadInfo) => {
        listerMap.forEach(function (upload, listener) {
          if (upload && upload.id == params.id) {
            try {
              listener.onUploadError()
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
