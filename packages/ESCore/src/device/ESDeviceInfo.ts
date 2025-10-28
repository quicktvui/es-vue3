/**
 * 设备信息
 */
export interface ESDeviceInfo {

  readonly cid?: string

  readonly device_ip: string
  readonly device_name: string

  readonly ethMac: string
  readonly wifiMac: string

  readonly totalMemory: number
  readonly availableMemory: number

  readonly screenWidth: number
  readonly screenHeight: number

  readonly resolution: string
  readonly density: number
  readonly densityDpi: number
  readonly scaledDensity: number

  readonly buildModel: string
  readonly buildBrand: string
  readonly buildBoard: string
  readonly buildDevice: string
  readonly buildProduct: string
  readonly buildHardware: string
  readonly buildManufacturer: string

  readonly buildSerial: string
  readonly buildTags: string
  readonly buildId: string
  readonly buildTime: number
  readonly buildType: string
  readonly buildUser: string
  readonly buildBootloader: string
  readonly buildDisplay: string
  readonly buildFingerPrint: string

  readonly buildVersionRelease: string
  readonly buildVersionIncremental: string
  readonly buildVersionBaseOS: string
  readonly buildVersionCodeName: string
  readonly buildVersionSecurityPatch: string
  readonly buildVersionPreviewSDKInt: number
  readonly buildVersionSDKInt: number

  readonly ipAddress: string
}
