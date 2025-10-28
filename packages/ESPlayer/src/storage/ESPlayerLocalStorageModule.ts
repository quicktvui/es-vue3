import {Native} from "@extscreen/es3-vue";

export interface ESPlayerLocalStorageModule {

  initSharedPreferences(name: string): Promise<boolean>

  initESSharedPreferences(name: string): Promise<boolean>

  getBoolean(key: string, defValue: boolean): Promise<boolean>

  putBoolean(key: string, value: boolean): Promise<boolean>

  getInt(key: string, defValue: number): Promise<number>

  putInt(key: string, value: number): Promise<boolean>

  getLong(key: string, defValue: number): Promise<number>

  putLong(key: string, value: number): Promise<boolean>

  getString(key: string, defValue: string): Promise<string>

  putString(key: string, value: string): Promise<boolean>
}

export function createESPlayerLocalStorageModule(): ESPlayerLocalStorageModule {

  function initSharedPreferences(name) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'initSharedPreferences', name);
  }

  function initESSharedPreferences(name) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'initESSharedPreferences', name);
  }

  //----------------------------------------------------
  function getBoolean(key, defValue) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'getBoolean', key, defValue);
  }

  function putBoolean(key, value) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'putBoolean', key, value);
  }

  //----------------------------------------------------

  function getInt(key, defValue) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'getInt', key, defValue);
  }

  function putInt(key, value) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'putInt', key, value);
  }

  //----------------------------------------------------

  function getLong(key, defValue) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'getLong', key, defValue);
  }

  function putLong(key, value) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'putLong', key, value);
  }

  //----------------------------------------------------
  function getString(key, defValue) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'getString', key, defValue);
  }

  function putString(key, value) {
    return Native.callNativeWithPromise('AndroidSharedPreferencesModule',
      'putString', key, value);
  }

  return {
    initSharedPreferences,
    initESSharedPreferences,
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
