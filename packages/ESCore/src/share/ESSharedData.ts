import {ESSharedDataMode} from "./ESSharedDataMode";
import {ESSharedDataType} from "./ESSharedDataType";

export interface ESSharedData {
  mode: ESSharedDataMode,
  type: ESSharedDataType,
  secretKey?: string,
  data: any,
}
