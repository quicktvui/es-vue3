import type {InjectionKey} from 'vue'
import {ESPlayerManagerEventManager} from "./event/ESPlayerManagerEventManager";
import {ESPlayerManagerViewManager} from "./view/ESPlayerManagerViewManager";
import {ESPlayerManagerPlayModeManager} from "./mode/ESPlayerManagerPlayModeManager";

export const playerManagerEventManagerKey = Symbol(
  'ESPlayerManagerEventManager'
) as InjectionKey<ESPlayerManagerEventManager>

export const playerManagerViewManagerKey = Symbol(
  'ESPlayerManagerViewManager'
) as InjectionKey<ESPlayerManagerViewManager>

export const playerManagerPlayModeManagerKey = Symbol(
  'ESPlayerManagerPlayModeManager'
) as InjectionKey<ESPlayerManagerPlayModeManager>



