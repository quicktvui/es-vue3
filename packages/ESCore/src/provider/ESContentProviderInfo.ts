import {ESContentValues} from "./ESContentValues";
import {ESContentProviderResult} from "./ESContentProviderResult";

export interface ESContentProviderInfo {
  result: ESContentProviderResult
  message?: string
  data?: Array<ESContentValues>
}
