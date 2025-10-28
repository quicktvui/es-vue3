import {ESEventBusContext} from "./ESEventBusContext";

export interface ESEventBusEvent {
  fn?: Function,
  context?: ESEventBusContext
  wrapper?: Function
}
