import {ESApp} from "@extscreen/es3-vue";
import ESAudioPlayer from "./index.vue";

export {
  ESAudioPlayer,
};

export const createESAudioPlayer = () => {
  return {
    install: function (app: ESApp): void {
    },
  }
}
