import {IESManager} from "../core";
import {App} from "vue";
import {createESContentProviderModule, ESContentProviderModule} from "./ESContentProviderModule";
import {ESContentValues} from "./ESContentValues";
import {ESContentProviderInfo} from "./ESContentProviderInfo";
import {ESContentProviderKey} from "../useApi";

export interface ESContentProvider extends IESManager {

  insert(uri: string, data: ESContentValues): Promise<ESContentProviderInfo>

  query(uri: string, projection?: Array<string>, selection?: string, selectionArgs?: Array<string>, sortOrder?: string, data?: ESContentValues): Promise<ESContentProviderInfo>

  update(uri: string, data: ESContentValues, where: string, selectionArgs: Array<string>): Promise<ESContentProviderInfo>

  deleteData(uri: string, where: string, selectionArgs: Array<string>): Promise<ESContentProviderInfo>
}

export function createESContentProvider(): ESContentProvider {

  const providerModule: ESContentProviderModule = createESContentProviderModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function insert(uri, data) {
    return providerModule.insert(uri, data);
  }

  function query(uri, projection, selection, selectionArgs, sortOrder, data) {
    return providerModule.query(uri, projection, selection, selectionArgs, sortOrder, data);
  }

  function update(uri, data, where, selectionArgs) {
    return providerModule.update(uri, data, where, selectionArgs);
  }

  function deleteData(uri, where, selectionArgs) {
    return providerModule.deleteData(uri, where, selectionArgs);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESContentProviderKey, instance)
    },
    init,
    insert,
    query,
    update,
    deleteData
  }
}
