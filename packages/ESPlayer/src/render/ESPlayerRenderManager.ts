import {App} from "vue";
import {ESPlayerRender} from "./ESPlayerRender";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {playerRenderManagerKey} from "../injectionSymbols";

export interface ESPlayerRenderManager extends ESIPlayerManager {

  getRender(): ESPlayerRender

  setRender(render: ESPlayerRender)
}

export function createESPlayerRenderManager(): ESPlayerRenderManager {

  let _render = ESPlayerRender.ES_PLAYER_RENDER_SURFACE_VIEW;

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function getRender(): ESPlayerRender {
    return _render;
  }

  function setRender(render: ESPlayerRender) {
    _render = render;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerRenderManagerKey, instance)
    },
    init,
    getRender,
    setRender,
  }
}
