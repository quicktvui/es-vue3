/**
 * 应用列表
 */
import {ESAppInfo} from "./ESAppInfo";

export interface ESAppInfoList {
  readonly system?: Array<ESAppInfo>
  readonly user?: Array<ESAppInfo>
}
