import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESDeviceInfo} from "./ESDeviceInfo";

export interface ESDeviceModule extends IESModule {

  getDevice(): Promise<ESDeviceInfo>

  getDeviceEthMac(): Promise<string>

  getDeviceWifiMac(): Promise<string>

  getDeviceTotalMemory(): Promise<number>

  getDeviceAvailMemory(): Promise<number>

  getScreenWidth(): Promise<number>

  getScreenHeight(): Promise<number>

  getResolution(): Promise<string>

  getDensity(): Promise<number>

  getDensityDpi(): Promise<number>

  getScaledDensity(): Promise<number>

  getBuildVersionRelease(): Promise<string>

  getBuildModel(): Promise<string>

  getBuildBrand(): Promise<string>

  getBuildDevice(): Promise<string>

  getBuildBoard(): Promise<string>

  getBuildProduct(): Promise<string>

  getBuildHardware(): Promise<string>

  getBuildManufacturer(): Promise<string>
}

export function createESDeviceModule(): ESDeviceModule {
  function getDevice() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getAndroidDevice');
  }

  function getDeviceEthMac() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getEthMac');
  }

  function getDeviceWifiMac() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getWifiMac');
  }

  function getDeviceTotalMemory() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getTotalMemory');
  }

  function getDeviceAvailMemory() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getAvailableMemory');
  }

  function getScreenWidth() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getScreenWidth');
  }

  function getScreenHeight() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getScreenHeight');
  }

  function getResolution() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getResolution');
  }

  function getDensity() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getDensity');
  }

  function getDensityDpi() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getDensityDpi');
  }

  function getScaledDensity() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getScaledDensity');
  }

  function getBuildVersionRelease() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildVersionRelease');
  }

  function getBuildModel() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildModel');
  }

  function getBuildBrand() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildBrand');
  }

  function getBuildDevice() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildDevice');
  }

  function getBuildBoard() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildBoard');
  }

  function getBuildProduct() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildProduct');
  }

  function getBuildHardware() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildHardware');
  }

  function getBuildManufacturer() {
    return Native.callNativeWithPromise('AndroidDeviceModule', 'getBuildManufacturer');
  }

  return {
    getDevice,
    getDeviceEthMac,
    getDeviceWifiMac,
    getDeviceTotalMemory,
    getDeviceAvailMemory,
    getScreenWidth,
    getScreenHeight,
    getResolution,
    getDensity,
    getDensityDpi,
    getScaledDensity,
    getBuildVersionRelease,
    getBuildModel,
    getBuildBrand,
    getBuildDevice,
    getBuildBoard,
    getBuildProduct,
    getBuildHardware,
    getBuildManufacturer
  }
}
