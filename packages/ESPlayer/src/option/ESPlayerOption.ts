/**
 *
 */
import {ESPlayerOptionType} from "./ESPlayerOptionType";

export interface ESPlayerOption {
  type: ESPlayerOptionType
  category: number
  name: string
  value: string | number
}


