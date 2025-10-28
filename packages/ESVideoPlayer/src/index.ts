import registerESVideoPlayerViewComponent from "./component/ESVideoPlayerViewComponent";
import {ESApp} from "@extscreen/es3-vue";
import ESVideoPlayer from "./index.vue";

export {
  ESVideoPlayer,
};

export const createESVideoPlayer = () => {
  return {
    install: function (app: ESApp): void {
      registerESVideoPlayerViewComponent(app)
    },
  }
}
