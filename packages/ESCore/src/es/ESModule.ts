import {Native} from '@extscreen/es3-vue';
import {ESDeviceInfo} from "../device";
import {ESSDKInfo} from "./ESSDKInfo";
import {IESModule, NeedToTyped} from "../core";

export interface ESModule extends IESModule {

  getESDeviceInfo(): Promise<ESDeviceInfo>

  getESSDKInfo(): Promise<ESSDKInfo>

  getESSDKVersionCode(): Promise<number>

  getESSDKVersionName(): Promise<string>

  getESPackageName(): Promise<string>

  getESMiniProgramPath(): Promise<string>

  getSupportSchemes(): Promise<Array<string>>

  launchESPageByArgs(args: Array<Array<any>>)

  launchESPage(params): Promise<NeedToTyped>

  launchNativeApp(paramsArray: Array<Array<any>>)

  launchNativeAppWithPackage(pkg: string): void

  finish(): void

  finishAll(): void

  isModuleRegistered(className: string): Promise<boolean>

  isComponentRegistered(className: string): Promise<boolean>
}

export function createESModule(): ESModule {

  //---------------------------------ESModule--------------------------
  function getESDeviceInfo() {
    return Native.callNativeWithPromise('EsNativeModule',
      'getDeviceInfo',);
  }

  function getESSDKInfo() {
    return Native.callNativeWithPromise('ESModule',
      'getESSDKInfo',);
  }

  function getESSDKVersionCode() {
    return Native.callNativeWithPromise('ESModule',
      'getESSDKVersionCode',);
  }

  function getESSDKVersionName() {
    return Native.callNativeWithPromise('ESModule',
      'getESSDKVersionName',);
  }

  function getESPackageName() {
    return Native.callNativeWithPromise('ESModule',
      'getESPackageName',);
  }

  function getESMiniProgramPath() {
    return Native.callNativeWithPromise('ESModule',
      'getESMiniProgramPath',);
  }

  function sendESNativeMapEventTop(eventName, mapParams) {
    return Native.callNativeWithPromise('ESModule',
      'sendESNativeMapEventTop', eventName, mapParams);
  }

  function sendESNativeArrayEventTop(eventName, arrayParams) {
    return Native.callNativeWithPromise('ESModule',
      'sendESNativeArrayEventTop', eventName, arrayParams);
  }

  function sendESNativeMapEventAll(eventName, mapParams) {
    return Native.callNativeWithPromise('ESModule',
      'sendESNativeMapEventAll', eventName, mapParams);
  }


  function sendESNativeArrayEventAll(eventName, arrayParams) {
    return Native.callNativeWithPromise('ESModule',
      'sendESNativeArrayEventAll', eventName, arrayParams);
  }

  //---------------------------------EsNativeModule-------------------------

  function getSupportSchemes() {
    return Native.callNativeWithPromise('EsNativeModule',
      'getSupportSchemes',);
  }

  function getVisiblePageSize() {
    return Native.callNativeWithPromise('EsNativeModule',
      'getVisiblePageSize',);
  }

  function launchESPageByArgs(args) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchEsPage', {
        args: args,
      });
  }

  function launchESPage(params) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchEsPage', {
        pkg: params.pkg,
        args: params.args,
        flags: params.flags,
        pageTag: params.pageTag,
        pageLimit: params.pageLimit,
        backgroundColor: params.backgroundColor,
        splash: params.splash,
      });
  }

  function launchNativeApp(paramsArray) {
    return Native.callNativeWithPromise('EsNativeModule',
      'launchNativeApp', paramsArray);
  }

  function launchNativeAppWithPackage(pkg) {
    Native.callNative('EsNativeModule',
      'launchNativeAppWithPackage', pkg);
  }

  function startService(paramsArray) {
    Native.callNative('EsNativeModule',
      'startService', paramsArray);
  }

  function finish() {
    Native.callNative('EsNativeModule', 'finish');
  }

  function finishAll() {
    Native.callNative('EsNativeModule', 'finishAll');
  }

  //----------------------------组件和模块注册相关--------------------------------------------

  function isModuleRegistered(className) {
    return Native.callNativeWithPromise('ESModule',
      'isModuleRegistered', className);
  }

  function isComponentRegistered(className) {
    return Native.callNativeWithPromise('ESModule',
      'isComponentRegistered', className);
  }

  return {
    getESDeviceInfo,
    getESSDKInfo,
    getESSDKVersionCode,
    getESSDKVersionName,
    getESPackageName,
    getESMiniProgramPath,
    getSupportSchemes,
    launchESPageByArgs,
    launchESPage,
    launchNativeApp,
    launchNativeAppWithPackage,
    finish,
    finishAll,
    isModuleRegistered,
    isComponentRegistered
  }
}
