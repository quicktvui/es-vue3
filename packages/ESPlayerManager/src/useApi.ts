import {inject} from 'vue'

import {
  playerManagerEventManagerKey,
  playerManagerViewManagerKey,
  playerManagerPlayModeManagerKey
} from './injectionSymbols'
import {ESPlayerManagerEventManager} from "./event/ESPlayerManagerEventManager";
import {ESPlayerManagerViewManager} from "./view/ESPlayerManagerViewManager";
import {ESPlayerManagerPlayModeManager} from "./mode/ESPlayerManagerPlayModeManager";

export function useESPlayerManagerEventManager(): ESPlayerManagerEventManager {
  return inject(playerManagerEventManagerKey)!
}

export function useESPlayerManagerViewManager(): ESPlayerManagerViewManager {
  return inject(playerManagerViewManagerKey)!
}

export function useESPlayerManagerPlayModeManager(): ESPlayerManagerPlayModeManager {
  return inject(playerManagerPlayModeManagerKey)!
}

