import {ESApp} from "@extscreen/es3-vue";
import ESSoundPoolPlayer from "./index.vue";

import {ESSoundPoolContentType} from "./core/ESSoundPoolContentType";
import {ESSoundPoolStreamType} from "./core/ESSoundPoolStreamType";
import {ESSoundPoolUsage} from "./core/ESSoundPoolUsage";

export {
  ESSoundPoolPlayer,
  ESSoundPoolContentType,
  ESSoundPoolStreamType,
  ESSoundPoolUsage
};


export const createESSoundPoolPlayer = () => {
  return {
    install: function (app: ESApp): void {
    },
  }
}
