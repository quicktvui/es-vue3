import {App} from "vue";
import {createESPlayerLocalStorageModule} from "./ESPlayerLocalStorageModule";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerLocalStorageManagerKey} from "../injectionSymbols";

export interface ESPlayerLocalStorageManager extends ESIPlayerManager {

  getBoolean(key: string, defValue: boolean): Promise<boolean>

  putBoolean(key: string, value: boolean): Promise<boolean>

  getInt(key: string, defValue: number): Promise<number>

  putInt(key: string, value: number): Promise<boolean>

  getLong(key: string, defValue: number): Promise<number>

  putLong(key: string, value: number): Promise<boolean>

  getString(key: string, defValue: string): Promise<string>

  putString(key: string, value: string): Promise<boolean>
}

export function createESPlayerLocalStorageManager(): ESPlayerLocalStorageManager {

  const localStorage = createESPlayerLocalStorageModule();

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  function _initLocalStorage() {
    return localStorage.initESSharedPreferences('player_local_storage');
  }

  function getBoolean(key, defValue) {
    return _initLocalStorage()
      .then(() => localStorage.getBoolean(key, defValue));
  }

  function putBoolean(key, value) {
    return _initLocalStorage()
      .then(() => localStorage.putBoolean(key, value));
  }

  //----------------------------------------------------

  function getInt(key, defValue) {
    return _initLocalStorage()
      .then(() => localStorage.getInt(key, defValue));
  }

  function putInt(key, value) {
    return _initLocalStorage()
      .then(() => localStorage.putInt(key, value));
  }

  //----------------------------------------------------

  function getLong(key, defValue) {
    return _initLocalStorage()
      .then(() => localStorage.getLong(key, defValue));
  }

  function putLong(key, value) {
    return _initLocalStorage()
      .then(() => localStorage.putLong(key, value));
  }

  //----------------------------------------------------
  function getString(key, defValue) {
    return _initLocalStorage()
      .then(() => localStorage.getString(key, defValue));
  }

  function putString(key, value) {
    return _initLocalStorage()
      .then(() => localStorage.putString(key, value));
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerLocalStorageManagerKey, instance)
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
  }
}
