import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESPluginInfo {
  pkg: string
}

export interface ESPluginModule extends IESModule {

  install(plugin: ESPluginInfo): void

}

export function createESPluginModule(): ESPluginModule {

  function install(plugin) {
    return Native.callNative('ESPluginModule', 'install', [plugin]);
  }

  return {
    install,
  }
}

