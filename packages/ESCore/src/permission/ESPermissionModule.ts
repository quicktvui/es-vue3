import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESRequestPermissionsResult} from "./ESRequestPermissionsResult";

export interface ESPermissionModule extends IESModule {

  isPermissionsGranted(permissionList: Array<string>): Promise<ESRequestPermissionsResult>

  requestPermissions(permissionList: Array<string>): Promise<ESRequestPermissionsResult>
}


export function createESPermissionModule(): ESPermissionModule {

  function isPermissionsGranted(permissionList) {
    return Native.callNativeWithPromise('AndroidPermissionModule',
      'isPermissionsGranted', permissionList);
  }

  function requestPermissions(permissionList) {
    return Native.callNativeWithPromise('AndroidPermissionModule',
      'requestPermissions', permissionList);
  }

  return {
    isPermissionsGranted,
    requestPermissions,
  }
}
