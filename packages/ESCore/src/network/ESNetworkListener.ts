import {ESNetworkInfo} from "./ESNetworkInfo";

export interface ESNetworkListener {

  onConnectivityChange(networkInfo: ESNetworkInfo | null): void
}
