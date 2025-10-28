import ESPlayerManager from "./index.vue";
import {ESMediaItem} from "./core/ESMediaItem";
import {createESPlayerManager} from "./core/ESPlayerManager";

ESPlayerManager.install = (Vue) => {
  Vue.component(ESPlayerManager.name, ESPlayerManager)
}

export {
  ESPlayerManager,
  createESPlayerManager,
};

export type {ESIPlayerManager} from "./core/ESIPlayerManager";
export type {ESMediaItem} from "./core/ESMediaItem";
export type {ESMediaItemList} from "./core/ESMediaItemList";
//event
export type {ESPlayerManagerEventListener} from "./event/ESPlayerManagerEventListener";
export {
  ESPlayerManagerEventDefaultListener
} from "./event/ESPlayerManagerEventDefaultListener";
//view
export {
  ESIPlayerManagerDefaultView
} from "./view/ESIPlayerManagerDefaultView";
//config
export type {ESPlayerManagerConfiguration} from "./core/ESPlayerManagerConfiguration";

import {
  useESPlayerManagerViewManager,
  useESPlayerManagerEventManager,
  useESPlayerManagerPlayModeManager
} from "./useApi";

export {
  useESPlayerManagerEventManager,
  useESPlayerManagerViewManager,
  useESPlayerManagerPlayModeManager
};

import SparseArray from "./utils/SparseArray";
import {ESPlayerManagerErrors} from "./core/ESPlayerManagerErrors";

export {
  ESPlayerManagerErrors,
  SparseArray,
};
