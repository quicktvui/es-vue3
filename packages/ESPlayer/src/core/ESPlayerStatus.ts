import {ESPlayerState} from "./ESPlayerState";

export interface ESPlayerStatus {
  playerState: ESPlayerState
  playerWidth?: number
  playerHeight?: number
  playerClickable?: boolean

  [prop: string]: any
}
