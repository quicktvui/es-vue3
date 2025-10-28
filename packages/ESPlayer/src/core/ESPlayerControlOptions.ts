import { ESPlayerCommand } from "./ESPlayerCommand";

export interface ESPlayerControlOptions {
  action: ESPlayerCommand;
  payload?: any;

  [prop: string]: any;
}
