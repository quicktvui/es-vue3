import {IESManager} from "../core";
import {App} from "vue";
import {ESDeviceKey} from "../useApi";
import {Native} from "@extscreen/es3-vue";
import {createESDeviceModule} from "./ESDeviceModule";
import {ESDeviceInfo} from "./ESDeviceInfo";

export interface ESDevice extends IESManager {

  getScreenWidth(): number

  getScreenHeight(): number

  getAndroidAPILevel(): string | null

  getDevice(): ESDeviceInfo

  getDeviceEthMac(): string

  getDeviceWifiMac(): string

  getDeviceTotalMemory(): number

  getDeviceAvailMemory(): number

  getScreenWidth(): number

  getScreenHeight(): number

  getResolution(): string

  getDensity(): number

  getDensityDpi(): number

  getScaledDensity(): number

  getIPAddress(): string

  getBuildModel(): string

  getBuildBrand(): string

  getBuildBoard(): string

  getBuildDevice(): string

  getBuildProduct(): string

  getBuildHardware(): string

  getBuildManufacturer(): string

  getBuildSerial(): string

  getBuildTags(): string

  getBuildId(): string

  getBuildTime(): number

  getBuildType(): string

  getBuildUser(): string

  getBuildBootloader(): string

  getBuildDisplay(): string

  getBuildFingerPrint(): string

  getBuildVersionIncremental(): string

  getBuildVersionBaseOS(): string

  getBuildVersionCodeName(): string

  getBuildVersionSecurityPatch(): string

  getBuildVersionPreviewSDKInt(): number

  getBuildVersionSDKInt(): number

  getBuildVersionRelease(): string
}

export function createESDevice(): ESDevice {

  let deviceInfo: ESDeviceInfo
  let deviceModule = createESDeviceModule()

  function init(...params: any[]): Promise<any> {
    return deviceModule.getDevice().then(
      (device) => {
        deviceInfo = device;
        return Promise.resolve()
      }
    );
  }

  function getAndroidAPILevel() {
    return Native.APILevel;
  }

  function getDevice() {
    return deviceInfo
  }

  function getDeviceEthMac() {
    return deviceInfo.ethMac
  }

  function getDeviceWifiMac() {
    return deviceInfo.wifiMac
  }

  function getDeviceTotalMemory() {
    return deviceInfo.totalMemory;
  }

  function getDeviceAvailMemory() {
    return deviceInfo.availableMemory
  }


  function getScreenWidth() {
    return deviceInfo.screenWidth;
  }

  function getScreenHeight() {
    return deviceInfo.screenHeight
  }

  function getResolution() {
    return deviceInfo.resolution;
  }

  function getDensity() {
    return deviceInfo.density;
  }

  function getDensityDpi() {
    return deviceInfo.densityDpi;
  }

  function getScaledDensity() {
    return deviceInfo.scaledDensity;
  }

  function getIPAddress() {
    return deviceInfo.ipAddress;
  }

  function getBuildModel() {
    return deviceInfo.buildModel;
  }

  function getBuildBrand() {
    return deviceInfo.buildBrand;
  }

  function getBuildBoard() {
    return deviceInfo.buildBoard;
  }

  function getBuildDevice() {
    return deviceInfo.buildDevice;
  }

  function getBuildProduct() {
    return deviceInfo.buildProduct;
  }

  function getBuildHardware() {
    return deviceInfo.buildHardware;
  }

  function getBuildManufacturer() {
    return deviceInfo.buildManufacturer;
  }

  function getBuildSerial() {
    return deviceInfo.buildSerial;
  }

  function getBuildTags() {
    return deviceInfo.buildTags;
  }

  function getBuildId() {
    return deviceInfo.buildId;
  }

  function getBuildTime() {
    return deviceInfo.buildTime;
  }

  function getBuildType() {
    return deviceInfo.buildType;
  }

  function getBuildUser() {
    return deviceInfo.buildUser;
  }

  function getBuildBootloader() {
    return deviceInfo.buildBootloader;
  }

  function getBuildDisplay() {
    return deviceInfo.buildDisplay;
  }


  function getBuildFingerPrint() {
    return deviceInfo.buildFingerPrint;
  }

  function getBuildVersionIncremental() {
    return deviceInfo.buildVersionIncremental;
  }

  function getBuildVersionBaseOS() {
    return deviceInfo.buildVersionBaseOS;
  }

  function getBuildVersionCodeName() {
    return deviceInfo.buildVersionCodeName;
  }

  function getBuildVersionSecurityPatch() {
    return deviceInfo.buildVersionSecurityPatch;
  }

  function getBuildVersionPreviewSDKInt() {
    return deviceInfo.buildVersionPreviewSDKInt;
  }

  function getBuildVersionSDKInt() {
    return deviceInfo.buildVersionSDKInt;
  }

  function getBuildVersionRelease() {
    return deviceInfo.buildVersionRelease;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESDeviceKey, instance)
    },
    init,
    getAndroidAPILevel,
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
    getIPAddress,
    getBuildModel,
    getBuildBrand,
    getBuildBoard,
    getBuildDevice,
    getBuildProduct,
    getBuildHardware,
    getBuildManufacturer,
    getBuildSerial,
    getBuildTags,
    getBuildId,
    getBuildTime,
    getBuildType,
    getBuildUser,
    getBuildBootloader,
    getBuildDisplay,
    getBuildFingerPrint,
    getBuildVersionIncremental,
    getBuildVersionBaseOS,
    getBuildVersionCodeName,
    getBuildVersionSecurityPatch,
    getBuildVersionPreviewSDKInt,
    getBuildVersionSDKInt,
    getBuildVersionRelease
  }
}
