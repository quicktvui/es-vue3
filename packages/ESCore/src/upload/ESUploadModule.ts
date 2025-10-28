/**
 *
 */
import {IESModule} from "@extscreen/es3-core";
import {Native} from "@extscreen/es3-vue";
import {ESUploadInfo} from "./ESUploadInfo";

export interface ESUploadModule extends IESModule {
  upload(info: ESUploadInfo): void
}

export function createESUploadModule(): ESUploadModule {

  function upload(info: ESUploadInfo) {
    Native.callNative('ESUploadModule', 'upload',
      info.url,
      info.mediaType,
      info.fileParamsKey,
      info.filePath,
      info.params,
      info.header);
  }

  return {
    upload,
  }
}
