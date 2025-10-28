import {Native} from "@extscreen/es3-vue";
import {ESContentProviderInfo} from "./ESContentProviderInfo";
import {ESContentValues} from "./ESContentValues";
import {IESModule} from "../core";

export interface ESContentProviderModule extends IESModule {

  insert(uri: string, data: ESContentValues): Promise<ESContentProviderInfo>

  query(uri: string, projection?: Array<string>, selection?: string, selectionArgs?: Array<string>, sortOrder?: string, data?: ESContentValues): Promise<ESContentProviderInfo>

  update(uri: string, data: ESContentValues, where: string, selectionArgs: Array<string>): Promise<ESContentProviderInfo>

  deleteData(uri: string, where: string, selectionArgs: Array<string>): Promise<ESContentProviderInfo>
}

export function createESContentProviderModule(): ESContentProviderModule {

  function insert(uri, data) {
    return Native.callNativeWithPromise('ESContentProviderModule', 'insert', uri, data);
  }

  function query(uri, projection, selection, selectionArgs, sortOrder, data) {
    return Native.callNativeWithPromise('ESContentProviderModule', 'query', uri, projection, selection, selectionArgs, sortOrder, data);
  }

  function update(uri, data, where, selectionArgs) {
    return Native.callNativeWithPromise('ESContentProviderModule', 'update', uri, data, where, selectionArgs);
  }

  function deleteData(uri, where, selectionArgs) {
    return Native.callNativeWithPromise('ESContentProviderModule', 'delete', uri, where, selectionArgs);
  }

  return {
    insert,
    query,
    update,
    deleteData,
  }
}
