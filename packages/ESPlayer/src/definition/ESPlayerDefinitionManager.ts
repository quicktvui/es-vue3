import {App} from "vue";
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {ESPlayerDefinition} from "./ESPlayerDefinition";
import {ESPlayerDefinitionStrategy} from "./ESPlayerDefinitionStrategy";
import {playerDefinitionManagerKey} from "../injectionSymbols";
import {ESPlayerLocalStorageManager} from "../storage/ESPlayerLocalStorageManager";
import {ESPlayerLog, ESPlayerLogLevel} from "../log/ESPlayerLog";

/**
 * 清晰度
 */
export interface ESPlayerDefinitionManager extends ESIPlayerManager {

  getDefinition(): ESPlayerDefinition

  setDefinition(definition: ESPlayerDefinition): void

  getDefinitionStrategy(): ESPlayerDefinitionStrategy

  setDefinitionStrategy(definitionStrategy: ESPlayerDefinitionStrategy): void
}

export function createESPlayerDefinitionManager(): ESPlayerDefinitionManager {

  let _definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD;
  let _definitionStrategy = ESPlayerDefinitionStrategy.ES_PLAYER_DEFINITION_STRATEGY_SPECIFIED_LOWER;

  let playerLocalStorageManager: ESPlayerLocalStorageManager
  let log: ESPlayerLog

  const PLAYER_LOCAL_STORAGE_KEY = 'ES_PLAYER_DEFINITION_KEY'

  function init(...params: any[]): Promise<any> {
    playerLocalStorageManager = params[0]
    log = params[1]
    return playerLocalStorageManager.getInt(PLAYER_LOCAL_STORAGE_KEY, ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD)
      .then((definition) => {
        _definition = definition
        return Promise.resolve()
      })
  }

  function getDefinition(): ESPlayerDefinition {
    return _definition;
  }

  function setDefinition(definition: ESPlayerDefinition): void {
    _definition = definition;
    playerLocalStorageManager.putInt(PLAYER_LOCAL_STORAGE_KEY, definition)
      .then((ret) => {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d('ESPlayerDefinitionManager', 'setDefinition:' + definition + " success!")
        }
      }, error => {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d('ESPlayerDefinitionManager', 'setDefinition:' + definition + " error! " + error)
        }
      })
  }

  function getDefinitionStrategy(): ESPlayerDefinitionStrategy {
    return _definitionStrategy;
  }

  function setDefinitionStrategy(definitionStrategy: ESPlayerDefinitionStrategy): void {
    _definitionStrategy = definitionStrategy;
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerDefinitionManagerKey, instance)
    },
    init,
    getDefinition,
    setDefinition,
    getDefinitionStrategy,
    setDefinitionStrategy
  }
}
