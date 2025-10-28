import {ESIntentDataAuthority} from "./ESIntentDataAuthority";
import {ESIntentDataPath} from "./ESIntentDataPath";
import {ESIntentDataSchemeSpecificPart} from "./ESIntentDataSchemeSpecificPart";

export interface ESIntentFilter {
  action: Array<string>
  scheme?: Array<string>
  category?: Array<string>
  type?: Array<string>
  authority?: Array<ESIntentDataAuthority>
  path?: Array<ESIntentDataPath>
  schemeSpecificPart?: Array<ESIntentDataSchemeSpecificPart>
}
