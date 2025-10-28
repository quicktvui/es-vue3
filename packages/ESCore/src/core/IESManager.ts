import {App} from "vue";

export interface IESManager {

  install(app: App): void

  init(...params: any[]): Promise<any>;
}
