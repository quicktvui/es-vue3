import { IESManager } from "../core";
import { App } from "vue";
import { ESLocalStorageKey } from "../useApi";
import { createESLocalStorageModule } from "./ESLocalStorageModule";
import { ES, ESVersion } from "../es";

export interface ESLocalStorage extends IESManager {
  getBoolean(key: string, defValue: boolean): Promise<boolean>;

  putBoolean(key: string, value: boolean): Promise<boolean>;

  getInt(key: string, defValue: number): Promise<number>;

  putInt(key: string, value: number): Promise<boolean>;

  getLong(key: string, defValue: number): Promise<number>;

  putLong(key: string, value: number): Promise<boolean>;

  getString(key: string, defValue: string): Promise<string>;

  putString(key: string, value: string): Promise<boolean>;

  getItem(key: string, defValue: string): Promise<string>;

  setItem(key: string, value: string): Promise<boolean>;
}

export function createESLocalStorage(): ESLocalStorage {
  const localStorage = createESLocalStorageModule();

  let esManager: ES;

  function init(...params: any[]): Promise<any> {
    esManager = params[0];
    return Promise.resolve();
  }

  function _initLocalStorage() {
    if (esManager.getESSDKVersionCode() >= ESVersion.ES_SDK_VERSION_22) {
      return localStorage.initESSharedPreferences("local_storage");
    } else {
      let packageName = esManager.getESPackageName();
      if (!packageName) {
        packageName = "es";
      }
      return localStorage.initSharedPreferences(packageName + "_local_storage");
    }
  }

  function getBoolean(key, defValue) {
    return _initLocalStorage().then(() => localStorage.getBoolean(key, defValue));
  }

  function putBoolean(key, value) {
    return _initLocalStorage().then(() => localStorage.putBoolean(key, value));
  }

  //----------------------------------------------------

  function getInt(key, defValue) {
    return _initLocalStorage().then(() => localStorage.getInt(key, defValue));
  }

  function putInt(key, value) {
    return _initLocalStorage().then(() => localStorage.putInt(key, value));
  }

  //----------------------------------------------------

  function getLong(key, defValue) {
    return _initLocalStorage().then(() => localStorage.getLong(key, defValue));
  }

  function putLong(key, value) {
    return _initLocalStorage().then(() => localStorage.putLong(key, value));
  }

  //----------------------------------------------------
  function getString(key, defValue) {
    return _initLocalStorage().then(() => localStorage.getString(key, defValue));
  }

  function putString(key, value) {
    return _initLocalStorage().then(() => localStorage.putString(key, value));
  }
  //----------------------------------------------------
  function getItem(key, defValue) {
    return _initLocalStorage().then(() => localStorage.getString(key, defValue));
  }

  function setItem(key, value) {
    return _initLocalStorage().then(() => localStorage.putString(key, value));
  }
  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESLocalStorageKey, instance);
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
    getItem,
    setItem,
  };
}
