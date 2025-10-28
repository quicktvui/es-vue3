import { IESManager } from "../core";
import { App } from "vue";
import { ESPluginKey } from "../useApi";
import { createESPluginModule, ESPluginInfo } from "./ESPluginModule";
import { EventBus, Native } from "@extscreen/es3-vue";

export interface ESPluginListener {
  onPluginInstallProgress(pkg: string, status: number, current: number, total: number);

  onPluginInstallSuccess(pkg: string, status: number, msg: string);

  onPluginInstallError(pkg: string, status: number, msg: string);
}

export interface ESPlugin extends IESManager {
  installPlugin(plugin: ESPluginInfo): void;

  addListener(plugin: ESPluginInfo, listener: ESPluginListener): void;

  removeListener(listener: ESPluginListener): void;
}

export function createESPlugin(): ESPlugin {
  const pluginModule = createESPluginModule();
  const listerMap = new Map<ESPluginListener, ESPluginInfo>();

  function init(...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      createWebview().then(
        (ret) => {
          resolve(ret);
        },
        (error) => {
          resolve(error);
        },
      );
    });
  }

  /**
   * 20250417 weipeng & liulipeng & yangsongsong
   *
   * fetch的时候，底层会触发WebView的初始化，WebView首次初始化会向ClassLoader插入dex，
   * 如果此时正在安装插件，会导致ClassLoader dex插入错乱，
   * 导致WebView异常崩溃。
   * 为了避免这个问题，我们需要在插件安装之前先初始化一个WebView，
   * 让它先操作ClassLoader，从而避免同时操作引发的问题。
   */
  function createWebview() {
    const data = {
      context: {
        from: "com.sunrain.toolkit.utils.Utils",
        method: "getApp",
        params: [],
      },
      entry: {
        from: "android.webkit.WebView",
        method: "constructor",
        params: ["context"],
      },
    };
    return Native.callNativeWithPromise("EsNativeModule", "callReflect", data);
  }

  function installPlugin(plugin) {
    pluginModule.install(plugin);
  }

  function addListener(plugin, listener) {
    const has = listerMap.has(listener);
    if (has) {
      return;
    }
    listerMap.set(listener, plugin);
  }

  function removeListener(listener) {
    const has = listerMap.has(listener);
    if (!has) {
      return;
    }
    listerMap.delete(listener);
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESPluginKey, instance);
      EventBus.$on("onESPluginStateChanged", (status) => {
        if (status.success) {
          if (status.status === 1002) {
            listerMap.forEach(function (plugin, listener) {
              if (plugin && plugin.pkg == status.pkg) {
                try {
                  listener.onPluginInstallProgress(
                    status.pkg,
                    status.status,
                    status.current,
                    status.total,
                  );
                } catch (e) {}
              }
            });
          } else {
            listerMap.forEach(function (plugin, listener) {
              if (plugin && plugin.pkg == status.pkg) {
                try {
                  listener.onPluginInstallSuccess(status.pkg, status.status, status.msg);
                } catch (e) {}
              }
            });
          }
        } else {
          listerMap.forEach(function (plugin, listener) {
            if (plugin && plugin.pkg == status.pkg) {
              try {
                listener.onPluginInstallError(status.pkg, status.status, status.msg);
              } catch (e) {}
            }
          });
        }
      });
    },
    init,
    installPlugin,
    addListener,
    removeListener,
  };
}
