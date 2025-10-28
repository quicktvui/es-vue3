import {IESManager} from "../core";
import {App} from "vue";
import {ESPermissionKey} from "../useApi";
import {createESPermissionModule, ESPermissionModule} from "./ESPermissionModule";
import {ESRequestPermissionsResult} from "./ESRequestPermissionsResult";

export interface ESPermission extends IESManager {

  isPermissionsGranted(permissionList: Array<string>): Promise<ESRequestPermissionsResult>

  requestPermissions(permissionList: Array<string>): Promise<ESRequestPermissionsResult>
}

export function createESPermission(): ESPermission {

  const permission: ESPermissionModule = createESPermissionModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function isPermissionsGranted(permissionList) {
    return permission.isPermissionsGranted(permissionList);
  }

  function requestPermissions(permissionList) {
    return permission.requestPermissions(permissionList);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESPermissionKey, instance)
    },
    init,
    isPermissionsGranted,
    requestPermissions,
  }
}
