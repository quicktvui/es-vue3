import {ESKeyAction} from "./ESKeyAction";
import {ESKeyCode} from "./ESKeyCode";

export interface ESKeyEvent {
  action: ESKeyAction
  keyCode: ESKeyCode
  keyRepeat: number
}
