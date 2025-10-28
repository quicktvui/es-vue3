import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {createESLocalStorageModule} from "../local/ESLocalStorageModule";
import {ESSharedDataParams} from "./ESSharedDataParams";
import {ESSharedDataMode} from "./ESSharedDataMode";
import {ESSharedDataType} from "./ESSharedDataType";
import {ESSharedData} from "./ESSharedData";

export interface ESShareDataModule extends IESModule {

  getBoolean(params: ESSharedDataParams, key: string, defValue: boolean): Promise<boolean>

  putBoolean(params: ESSharedDataParams, key: string, value: boolean, mode: ESSharedDataMode): Promise<boolean>

  getInt(params: ESSharedDataParams, key: string, defValue: number): Promise<number>

  putInt(params: ESSharedDataParams, key: string, value: number, mode: ESSharedDataMode): Promise<boolean>

  getLong(params: ESSharedDataParams, key: string, defValue: number): Promise<number>

  putLong(params: ESSharedDataParams, key: string, value: number, mode: ESSharedDataMode): Promise<boolean>

  getString(params: ESSharedDataParams, key: string, defValue: string): Promise<string>

  putString(params: ESSharedDataParams, key: string, value: string, mode: ESSharedDataMode): Promise<boolean>

  getArray(params: ESSharedDataParams, key: string, defValue: Array<any>): Promise<Array<any>>

  putArray(params: ESSharedDataParams, key: string, value: Array<any>, mode: ESSharedDataMode): Promise<boolean>

  getMap(params: ESSharedDataParams, key: string, defValue: Map<any, any>): Promise<Map<any, any>>

  putMap(params: ESSharedDataParams, key: string, value: Map<any, any>, mode: ESSharedDataMode): Promise<boolean>
}


export function createESShareDataModule(packageName: string): ESShareDataModule {

  function getBoolean(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getBoolean',
      params, key, defValue);
  }

  function putBoolean(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putBoolean',
      params, key, defValue, mode);
  }

  //
  function getInt(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getInt',
      params, key, defValue);
  }

  function putInt(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putInt',
      params, key, defValue, mode);
  }

  //
  function getLong(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getLong',
      params, key, defValue);
  }

  function putLong(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putLong',
      params, key, defValue, mode);
  }

  //
  function getString(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getString',
      params, key, defValue);
  }

  function putString(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putString',
      params, key, defValue, mode);
  }

  //
  function getArray(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getArray',
      params, key, defValue);
  }

  function putArray(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putArray',
      params, key, defValue, mode);
  }

  //
  function getMap(params, key, defValue) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'getMap',
      params, key, defValue);
  }

  function putMap(params, key, defValue, mode) {
    return Native.callNativeWithPromise('ESGroupDataModule', 'putMap',
      params, key, defValue, mode);
  }

  return {
    getBoolean,
    putBoolean,
    getInt,
    putInt,
    getLong,
    putLong,
    getString,
    putString,
    getArray,
    putArray,
    getMap,
    putMap,
  }
}


export function createESSPDataModule(packageName: string): ESShareDataModule {
  //
  const _sharedDataFilePostfix = '_group_data';
  const localStorage = createESLocalStorageModule();

  function getBoolean(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putBoolean(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_BOOLEAN, key, value, mode);
  }

  //
  function getInt(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putInt(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_INT, key, value, mode);
  }

  //
  function getLong(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putLong(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_LONG, key, value, mode);
  }

  //
  function getString(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putString(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_STRING, key, value, mode);
  }

  //
  function getArray(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putArray(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_ARRAY, key, value, mode);
  }

  //
  function getMap(params, key, defValue) {
    return _getSharedData(params, key, defValue);
  }

  function putMap(params, key, value, mode) {
    return _putSharedData(params, ESSharedDataType.ES_SHARED_DATA_TYPE_MAP, key, value, mode);
  }

  //---------------------------------------------------
  function _getSharedData(params, key, defValue) {
    if (!params || !params.packageName) {
      return Promise.resolve(defValue);
    }
    let fileName = params.packageName + _sharedDataFilePostfix;
    return localStorage.initSharedPreferences(fileName)
      .then(() => localStorage.getString(key, ''))
      .then((result) => {
          if (result && result !== '') {
            try {
              let shareData = JSON.parse(result);
              if (shareData) {
                return Promise.resolve(shareData.data);
              }
            } catch (e) {
            }
          }
          return Promise.resolve(defValue);
        }
      );
  }

  function _putSharedData(params, type, key, value, mode) {
    if (!params || !params.packageName) {
      return Promise.resolve(false);
    }

    let selfPackageName = packageName;
    let fileName = params.packageName + _sharedDataFilePostfix;

    //----------------------self------------------------------
    if (selfPackageName === params.packageName) {
      return _pushSPSharedData(fileName, key, {
        mode: mode,
        type: type,
        secretKey: params.secretKey,
        data: value,
      });
    }
    //-----------------------other-----------------------------
    return localStorage.initSharedPreferences(fileName)
      .then(() => localStorage.getString(key, ''))
      .then((result) => {
          if (result && result !== '') {
            try {
              let shareData: ESSharedData = JSON.parse(result);
              if (shareData && shareData.mode >= ESSharedDataMode.ES_SHARED_DATA_MODE_WORLD_WRITEABLE
                && ((!shareData.secretKey)
                  || (shareData.secretKey && shareData.secretKey === params.secretKey))) {
                return _pushSPSharedData(fileName, key, {
                  mode: shareData.mode,
                  type: shareData.type,
                  secretKey: shareData.secretKey,
                  data: value,
                });
              }
            } catch (e) {
            }
          }
          return Promise.resolve(false);
        }
      );
  }

  function _pushSPSharedData(fileName, key, sharedData) {
    return localStorage.initSharedPreferences(fileName)
      .then(() => localStorage.putString(key, JSON.stringify(sharedData)));
  }

  return {
    getBoolean,
    putBoolean,
    getInt,
    putInt,
    getLong,
    putLong,
    getString,
    putString,
    getArray,
    putArray,
    getMap,
    putMap,
  }
}
