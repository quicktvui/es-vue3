import {ESLocationInfo} from "./ESLocationInfo";

export interface ESLocationListener {

  onLocationChange(location: ESLocationInfo | null): void
}
