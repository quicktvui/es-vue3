/**
 * 网络信息
 */
import {ESNetworkInfoType} from "./ESNetworkInfoType";
import {ESNetworkInfoState} from "./ESNetworkInfoState";

export interface ESNetworkInfo {
  readonly type: ESNetworkInfoType
  readonly typeName: string
  readonly subtype: number
  readonly state: ESNetworkInfoState
  readonly extraInfo: string
  readonly isAvailable: boolean
  readonly isConnected: boolean
  readonly isConnectedOrConnecting: boolean
  readonly isFailover: boolean
  readonly isRoaming: boolean
  readonly detailedState: number
  readonly describeContents: number
}
