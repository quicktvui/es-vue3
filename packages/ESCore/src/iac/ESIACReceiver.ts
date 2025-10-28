import {ESIACMessage} from "./ESIACMessage";

export interface ESIACReceiver {
  onReceive(message: ESIACMessage): void
}
