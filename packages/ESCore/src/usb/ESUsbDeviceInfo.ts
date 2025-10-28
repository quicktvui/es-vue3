export interface ESUsbDeviceInfo {
  readonly deviceName: string
  readonly vendorId: number
  readonly productId: number
  readonly deviceId: number
  readonly deviceProtocol: number

  readonly productName?: string
  readonly serialNumber?: string
  readonly manufacturerName?: string
}
