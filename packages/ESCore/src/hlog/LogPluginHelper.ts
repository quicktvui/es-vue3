import { createES } from "../es/ES";
import { createESPlugin } from "../plugin/ESPlugin";
import { EventBus } from "@extscreen/es3-vue";

export interface LogPluginHelper {
  isHLogModuleRegistered(): Promise<boolean>;

  installHLogPlugin(pkg: string): Promise<null>;
}

export function createLogPluginHelper(): LogPluginHelper {
  const es = createES();
  const plugin = createESPlugin();

  function isHLogModuleRegistered(): Promise<boolean> {
    return es.isModuleRegistered("eskit.sdk.support.log.hlog.ESHLogModule");
  }

  function installHLogPlugin(pkg: string): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      const callback = (status) => {
        if (status && pkg === status.pkg)
          if (status.success) {
            if (status.status !== 1002) {
              EventBus.$off("onESPluginStateChanged", callback);
              resolve(null);
            }
          } else {
            EventBus.$off("onESPluginStateChanged", callback);
            reject(status.msg);
          }
      };

      EventBus.$on("onESPluginStateChanged", callback);
      plugin.installPlugin({ pkg: pkg });
    });
  }

  return {
    isHLogModuleRegistered,
    installHLogPlugin,
  };
}
