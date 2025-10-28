import {IESManager} from "../core";
import {App} from "vue";
import {ESShareDataKey} from "../useApi";
import {
  createESShareDataModule,
  createESSPDataModule,
  ESShareDataModule
} from "./ESShareDataModule";
import {ESVersion, ES} from "../es";
import {ESSharedDataMode} from "./ESSharedDataMode";
import {ESSharedDataParams} from "./ESSharedDataParams";

export interface ESShareData extends IESManager {

  getBoolean(params: ESSharedDataParams, key: string, defValue: boolean): Promise<boolean>

  putBoolean(params: ESSharedDataParams, key: string, value: boolean, mode: ESSharedDataMode): Promise<boolean>

  getInt(params: ESSharedDataParams, key: string, defValue: number): Promise<number>

  putInt(params: ESSharedDataParams, key: string, value: number, mode: ESSharedDataMode): Promise<boolean>

  getLong(params: ESSharedDataParams, key: string, defValue: number): Promise<number>

  putLong(params: ESSharedDataParams, key: string, value: number, mode: ESSharedDataMode): Promise<boolean>

  getString(params: ESSharedDataParams, key: string, defValue: string | null | undefined): Promise<string>

  putString(params: ESSharedDataParams, key: string, value: string, mode: ESSharedDataMode): Promise<boolean>

  getArray(params: ESSharedDataParams, key: string, defValue: Array<any> | null | undefined): Promise<Array<any>>

  putArray(params: ESSharedDataParams, key: string, value: Array<any>, mode: ESSharedDataMode): Promise<boolean>

  getMap(params: ESSharedDataParams, key: string, defValue: Map<any, any> | undefined | null): Promise<Map<any, any>>

  putMap(params: ESSharedDataParams, key: string, value: Map<any, any>, mode: ESSharedDataMode): Promise<boolean>

}

export function createESShareData(): ESShareData {

  let esManager: ES
  let packageName = ""
  let shareDataModule: ESShareDataModule

  function init(...params: any[]): Promise<any> {
    esManager = params[0]
    packageName = esManager.getESPackageName()

    let sdkVersion = esManager.getESSDKVersionCode();
    if (sdkVersion >= ESVersion.ES_SDK_VERSION_22) {
      shareDataModule = createESShareDataModule(packageName);
    } else {
      shareDataModule = createESSPDataModule(packageName);
    }
    return Promise.resolve();
  }

  function getBoolean(params, key, defValue) {
    return shareDataModule.getBoolean(params, key, defValue);
  }

  function putBoolean(params, key, value, mode) {
    return shareDataModule.putBoolean(params, key, value, mode);
  }

  //
  function getInt(params, key, defValue) {
    return shareDataModule.getInt(params, key, defValue);
  }

  function putInt(params, key, value, mode) {
    return shareDataModule.putInt(params, key, value, mode);
  }

  //
  function getLong(params, key, defValue) {
    return shareDataModule.getLong(params, key, defValue);
  }

  function putLong(params, key, value, mode) {
    return shareDataModule.putLong(params, key, value, mode);
  }

  //
  function getString(params, key, defValue) {
    return shareDataModule.getString(params, key, defValue);
  }

  function putString(params, key, value, mode) {
    return shareDataModule.putString(params, key, value, mode);
  }

  //
  function getArray(params, key, defValue) {
    return shareDataModule.getArray(params, key, defValue);
  }

  function putArray(params, key, value, mode) {
    return shareDataModule.putArray(params, key, value, mode);
  }

  //
  function getMap(params, key, defValue) {
    return shareDataModule.getMap(params, key, defValue);
  }

  function putMap(params, key, value, mode) {
    return shareDataModule.putMap(params, key, value, mode);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESShareDataKey, instance)
    },
    init,
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
