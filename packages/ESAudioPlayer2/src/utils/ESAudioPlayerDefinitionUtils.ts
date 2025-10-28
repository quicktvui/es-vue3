/**
 *
 */
import {ESMediaSource, ESPlayerDefinition} from "@extscreen/es3-player";

export function getDefinition(mediaSource: ESMediaSource): ESPlayerDefinition {
  return mediaSource.definition ?? ESPlayerDefinition.ES_PLAYER_DEFINITION_UNKNOWN
}

export function getDefinitionList(mediaSourceList: Array<ESMediaSource>): Array<ESPlayerDefinition> {
  if (mediaSourceList.length <= 0) {
    return [];
  }
  let definitionList: ESPlayerDefinition[] = [];
  for (let i = 0; i < mediaSourceList.length; i++) {
    let url = mediaSourceList[i];
    let definition = getDefinition(url);
    if (definition !== ESPlayerDefinition.ES_PLAYER_DEFINITION_UNKNOWN) {
      definitionList.push(definition);
    }
  }
  return definitionList;
}

export function getMediaSourceByDefinition(definition: ESPlayerDefinition,
                                           mediaSourceList: Array<ESMediaSource>): number {
  return mediaSourceList.findIndex((mediaSource: ESMediaSource) => mediaSource.definition === definition)
}
