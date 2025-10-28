/**
 * 播放器配置信息
 */
import {ESPlayerDisplay} from "../display/ESPlayerDisplay";
import {ESPlayerOption} from "../option/ESPlayerOption";
import {ESPlayerDevice} from "../device/ESPlayerDevice";

export interface ESPlayerConfiguration {
  debug?: boolean
  device: ESPlayerDevice
  display?: ESPlayerDisplay
  options?: Array<ESPlayerOption>
}


