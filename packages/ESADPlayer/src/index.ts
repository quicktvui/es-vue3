import ESADPlayer from "./index.vue";
import {ESADType} from "./core/ESADType";
import {ESApp} from "@extscreen/es3-vue";
import registerESADPlayerViewComponent from "./component/ESADPlayerViewComponent";

ESADPlayer.install = (Vue) => {
  Vue.component(ESADPlayer.name, ESADPlayer)
}

export {
  ESADPlayer,
  ESADType,
};

export const createESADPlayer = () => {
  return {
    install: function (app: ESApp): void {
      registerESADPlayerViewComponent(app)
    },
  }
}



