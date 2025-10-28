import {Native} from "@extscreen/es3-vue";
import {ESLog, IESModule, useESLog} from "@extscreen/es3-core";
import {ESProviderInfo} from "../core/ESProviderInfo";
import {ESProvider} from "../core/ESProvider";

export interface ESContentProviderModule extends IESModule {

    insert(uri: string, data: ESProvider): Promise<ESProviderInfo>

    query(uri: string, projection?: Array<string>, selection?: string, selectionArgs?: Array<string>, sortOrder?: string, data?: ESProvider): Promise<ESProviderInfo>

    update(uri: string, data: ESProvider, where: string, selectionArgs: Array<string>): Promise<ESProviderInfo>

    deleteData(uri: string, where: string, selectionArgs: Array<string>): Promise<ESProviderInfo>
}

export function createESContentProviderModule(): ESContentProviderModule {

    function insert(uri, data) {
        return Native.callNativeWithPromise('ESContentProviderModule', 'insert', uri, data);
    }

    function query(uri, projection, selection, selectionArgs, sortOrder, data) {
        return Native.callNativeWithPromise('ESContentProviderModule', 'query', uri, projection ?? [], selection ?? "", selectionArgs ?? [], sortOrder ?? "", data ?? undefined);
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
