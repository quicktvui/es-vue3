import {ESUsbDeviceInfo} from "./ESUsbDeviceInfo";

export interface ESUsbDeviceListener {

  onUsbDeviceAttached(usbDeviceInfo: ESUsbDeviceInfo): void

  onUsbDeviceDetached(usbDeviceInfo: ESUsbDeviceInfo): void
}
