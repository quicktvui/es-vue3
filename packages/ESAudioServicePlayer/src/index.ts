import {ESApp} from "@extscreen/es3-vue";
import ESAudioServicePlayer from "./index.vue";

export {
  ESAudioServicePlayer,
};

export const createESAudioServicePlayer = () => {
  return {
    install: function (app: ESApp): void {
    },
  }
}
