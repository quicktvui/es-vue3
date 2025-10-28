import {Native} from '@extscreen/es3-vue';
import {NativeRouteLocationRaw} from "../types";
import {NavigationFailure} from "../errors";

export interface ESNativeRouter {

  launch(to: Array<Array<any>>): Promise<NavigationFailure | void | undefined>

  launchByPackage(to: string): Promise<NavigationFailure | void | undefined>

  push(to: NativeRouteLocationRaw): Promise<NavigationFailure | void | undefined>

  replace(to: NativeRouteLocationRaw): Promise<NavigationFailure | void | undefined>

  back(): ReturnType<ESNativeRouter['go']>

  forward(): ReturnType<ESNativeRouter['go']>

  go(delta: number): boolean

}

export function createESNativeRouter(isSupportSlotType: boolean): ESNativeRouter {

  function push(to: NativeRouteLocationRaw) {
    //
    if (to.args) {
      if ("name" in to.args && to.args.name) {
        to.args.url = to.args.name
      }
      if ("path" in to.args && to.args.path) {
        to.args.url = to.args.path
      }
    }

    //
    return Native.callNativeWithPromise('EsNativeModule',
      'launchEsPage', {
        pkg: to.pkg,//快应用的包名
        args: to.args,
        flags: to.flags,
        pageTag: to.pageTag,
        pageLimit: to.pageLimit,
        bgColor: to.backgroundColor,
        splash: to.splash,
        ver: to.version,
        minVer: to.minVersion,
        transparent: to.transparent,
        isCard: to.isCard,
        repository: to.repository,
        uri: to.uri,
        name: to.name,
        icon: to.icon,
        checkNetwork: to.checkNetwork
      });
  }

  function replace(to: NativeRouteLocationRaw) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchEsPage', {
        pkg: to.pkg,//快应用的包名
        args: to.args,
        flags: to.flags,
        pageTag: to.pageTag,
        pageLimit: to.pageLimit,
        bgColor: to.backgroundColor,
        splash: to.splash,
        ver: to.version,
        minVer: to.minVersion,
        transparent: to.transparent,
        isCard: to.isCard
      });
  }

  function launch(paramsArray) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchNativeApp', paramsArray);
  }

  function launchByPackage(packageName) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchNativeAppWithPackage', packageName);
  }

  function go(delta: number) {
    console.log('NativeRouter:go start:' + delta)
    if (delta < 0) {
      console.log('NativeRouter:go ' + delta + ' call finish')
      if (isSupportSlotType) {
        console.log('NativeRouter:SlotModule invokeDefaultBackPressHandler')
        Native.callNative('SlotModule', 'invokeDefaultBackPressHandler');
      } else {
        console.log('NativeRouter:EsNativeModule finish')
        Native.callNative('EsNativeModule', 'finish');
      }
      //TODO 判断sdk版本进行处理
      // console.log('NativeRouter:go ' + delta + ' call invokeDefaultBackPressHandler')
      // Native.callNative('DeviceEventModule', 'invokeDefaultBackPressHandler');
      return true;
    }
    return false;
  }

  return {
    push,
    replace,
    launch,
    launchByPackage,
    go,
    back: () => go(-1),
    forward: () => go(1),
  }
}
