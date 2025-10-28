import {App} from "vue";

export interface ESIPlayerManager {

  install(app: App): void

  init(...params: any[]): Promise<any>;
}
