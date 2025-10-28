import {ESApp} from "@extscreen/es3-vue";
import ESAudioPlayer2 from "./index.vue";

export type {ESAudioExtraData} from './core/ESAudioExtraData'

export {
  ESAudioPlayer2,
};

export const createESAudioPlayer = () => {
  return {
    install: function (app: ESApp): void {
    },
  }
}
