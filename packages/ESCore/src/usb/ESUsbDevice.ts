import {IESManager} from "../core";
import {App} from "vue";
import {ESUsbKey} from "../useApi";
import {createESUsbDeviceModule, ESUsbDeviceModule} from "./ESUsbDeviceModule";
import {EventBus} from "@extscreen/es3-vue";
import {ESUsbDeviceInfo} from "./ESUsbDeviceInfo";
import {ESUsbDeviceListener} from "./ESUsbDeviceListener";

export interface ESUsbDevice extends IESManager {

  isUsbDevicePermissionsGranted(vendorId: number, productId: number): Promise<boolean>

  requestUsbDevicePermission(permission: string, vendorId: number, productId: number): Promise<boolean>

  getUsbDeviceList(): Promise<Array<ESUsbDeviceInfo>>

  getUsbDevice(vendorId: number, productId: number): Promise<ESUsbDeviceInfo>

  getUsbDeviceListByArray(array: Array<Array<number>>): Promise<Array<ESUsbDeviceInfo>>

  addListener(listener: ESUsbDeviceListener): void

  removeListener(listener: ESUsbDeviceListener): void
}

export function createESUsbDevice(): ESUsbDevice {

  const usbModule: ESUsbDeviceModule = createESUsbDeviceModule()
  const listerList: Array<ESUsbDeviceListener> = []

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function isUsbDevicePermissionsGranted(vendorId, productId) {
    return usbModule.isUsbDevicePermissionsGranted(vendorId, productId);
  }

  function requestUsbDevicePermission(permission, vendorId, productId) {
    return usbModule.requestUsbDevicePermission(permission, vendorId, productId);
  }

  function getUsbDeviceList() {
    return usbModule.getUsbDeviceList();
  }

  function getUsbDevice(vendorId, productId) {
    return usbModule.getUsbDevice(vendorId, productId);
  }

  function getUsbDeviceListByArray(array) {
    return usbModule.getUsbDeviceListByArray(array);
  }

  function addListener(listener) {
    const index = listerList.findIndex((l) => l === listener)
    if (index > -1) {
      return;
    }
    listerList.push(listener)
  }

  function removeListener(listener) {
    const index = listerList.findIndex((l) => l === listener)
    if (index > -1) {
      listerList.splice(index, 1);
    }
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESUsbKey, instance)
      EventBus.$on('onUsbDeviceAttached', (usbDevice) => {
        listerList.forEach((listener) => {
          listener.onUsbDeviceAttached(usbDevice)
        });
      });

      EventBus.$on('onUsbDeviceDetached', (usbDevice) => {
        listerList.forEach((listener) => {
          listener.onUsbDeviceDetached(usbDevice)
        });
      });
    },
    init,
    isUsbDevicePermissionsGranted,
    requestUsbDevicePermission,
    getUsbDeviceList,
    getUsbDevice,
    getUsbDeviceListByArray,
    addListener,
    removeListener
  }
}
