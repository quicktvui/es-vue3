import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESUsbDeviceInfo} from "./ESUsbDeviceInfo";

export interface ESUsbDeviceModule extends IESModule {

  isUsbDevicePermissionsGranted(vendorId: number, productId: number): Promise<boolean>

  requestUsbDevicePermission(permission: string, vendorId: number, productId: number): Promise<boolean>

  getUsbDeviceList(): Promise<Array<ESUsbDeviceInfo>>

  getUsbDevice(vendorId: number, productId: number): Promise<ESUsbDeviceInfo>

  getUsbDeviceListByArray(array: Array<Array<string>>): Promise<Array<ESUsbDeviceInfo>>
}

export function createESUsbDeviceModule(): ESUsbDeviceModule {
  function isUsbDevicePermissionsGranted(vendorId, productId) {
    return Native.callNativeWithPromise('AndroidUsbDeviceModule',
      'isUsbDevicePermissionsGranted', vendorId, productId);
  }

  function requestUsbDevicePermission(permission, vendorId, productId) {
    return Native.callNativeWithPromise('AndroidUsbDeviceModule',
      'requestUsbDevicePermission', permission, vendorId, productId);
  }

  function getUsbDeviceList() {
    return Native.callNativeWithPromise('AndroidUsbDeviceModule',
      'getUsbDeviceList');
  }

  function getUsbDevice(vendorId, productId) {
    return Native.callNativeWithPromise('AndroidUsbDeviceModule',
      'getUsbDevice', [vendorId, productId]);
  }

  function getUsbDeviceListByArray(array) {
    return Native.callNativeWithPromise('AndroidUsbDeviceModule',
      'getUsbDeviceListByArray', array);
  }

  return {
    isUsbDevicePermissionsGranted,
    requestUsbDevicePermission,
    getUsbDeviceList,
    getUsbDevice,
    getUsbDeviceListByArray
  }
}
