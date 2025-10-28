import {ESIntentFilter} from "./ESIntentFilter";

export interface ESBroadcastReceiver {
  onReceive(intent: ESIntentFilter): void
}
