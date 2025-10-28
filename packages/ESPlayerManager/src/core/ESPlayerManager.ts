import {App} from "vue";
import {ESPlayerManagerConfiguration} from "./ESPlayerManagerConfiguration";
import {createESPlayerManagerViewManager} from "../view/ESPlayerManagerViewManager";
import {createESPlayerManagerEventManager} from "../event/ESPlayerManagerEventManager";
import {createESPlayerManagerPlayModeManager} from "../mode/ESPlayerManagerPlayModeManager";
import {
  playerManagerEventManagerKey,
  playerManagerViewManagerKey,
  playerManagerPlayModeManagerKey
} from "../injectionSymbols";

export interface ESPlayerManager {
  install(app: App): void

  init(configuration: ESPlayerManagerConfiguration): Promise<any>
}

export function createESPlayerManager(): ESPlayerManager {
  const playerManagerViewManager = createESPlayerManagerViewManager()
  const playerManagerEventManager = createESPlayerManagerEventManager()
  const playerManagerPlayModeManager = createESPlayerManagerPlayModeManager()

  let config: ESPlayerManagerConfiguration

  function init(configuration: ESPlayerManagerConfiguration): Promise<any> {
    config = configuration
    return Promise.resolve()
  }

  return {
    install: function (app: App) {
      app.provide(playerManagerEventManagerKey, playerManagerEventManager)
      app.provide(playerManagerViewManagerKey, playerManagerViewManager)
      app.provide(playerManagerPlayModeManagerKey, playerManagerPlayModeManager)
    },
    init,
  }
}
