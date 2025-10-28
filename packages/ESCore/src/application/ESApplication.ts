import { createApp, ESApp, ESAppOptions, Native } from "@extscreen/es3-vue";
import { Component, ComponentPublicInstance } from "@vue/runtime-core";
import { ESRouter, initESRouter } from "../router/ESRouter";

import { createESAppLifecycleManager, ESAppLifecycleManager } from "./ESAppLifecycleManager";
import { createESAppKeyManager, ESAppKeyManager } from "./ESAppKeyManager";
import { createESRouterManager, ESRouterManager } from "../router/ESRouterManager";
import { createESAppModuleManager, ESAppModuleManager } from "./ESAppModuleManager";
import { ESAppKey } from "../useApi";
import { ESAppContext } from "./ESAppContext";

//Application
export const createESApp = (
  vueRootComponent: Component,
  esRouter?: ESRouter,
  options?: ESAppOptions,
): ESAppContext => {
  //Application按键管理
  const appKeyManager: ESAppKeyManager = createESAppKeyManager();
  //Application生命管理
  const appLifecycleManager: ESAppLifecycleManager = createESAppLifecycleManager();
  // 默认配置
  const defaultOptions: ESAppOptions = {
    appName: "EsApp",
  };
  // 合并传入的 options，强制 appName 为 "EsApp"
  const mergedOptions: ESAppOptions = {
    ...defaultOptions, // 先应用默认值
    ...(options || {}), // 然后用用户选项覆盖（如果用户提供了 appName 会被覆盖）
  };

  const app: ESApp = createApp(vueRootComponent, mergedOptions);
  app.provide(ESAppKey, app);
  //----------------------------------------------------------------------------
  //ESRouter
  const router = initESRouter(esRouter);
  if (router) {
    app.use(router);
  }
  //路由管理
  const routerManager: ESRouterManager = createESRouterManager(router);
  routerManager.init();
  app.use(routerManager);

  //模块管理
  const appModuleManager: ESAppModuleManager = createESAppModuleManager();
  app.use(appModuleManager);

  //----------------------------------------------------------------------------
  //
  let applicationInstance: ComponentPublicInstance;
  let applicationProps;

  //
  const initCallback = ({ superProps, rootViewId }) => {
    applicationInstance = app.mount("#root");
    applicationProps = superProps;
    _initApplicationKeyEvent(applicationInstance);
    _initApplicationLifecycleEvent(applicationInstance);
    _initES();
  };

  const _initES = () => {
    Native.callNative("DeviceEventModule", "setListenBackPress", true);
    //
    if (__enableModules()) {
      appModuleManager.init(app).then(
        (result) => {
          _initESApplication();
        },
        (error) => {
          _initESApplication();
        },
      );
    } else {
      _initESApplication();
    }
  };

  const _initESApplication = () => {
    let result = appLifecycleManager.onESCreate(
      applicationInstance,
      app,
      routerManager.normalizeParams(applicationProps),
    );
    if (result instanceof Promise) {
      result.then(
        (success) => {
          _onESCreated(true);
        },
        (error) => {
          _onESCreated(false);
        },
      );
    } else {
      _onESCreated(true);
    }
  };

  const _onESCreated = (success) => {
    //######################################################################
    //onESCreated
    try {
      appLifecycleManager.onESCreated(applicationInstance, success);
    } catch (e) {}
    //######################################################################
    if (routerManager.isAutoRedirectEnabled()) {
      //路由跳转
      routerManager.push(applicationProps);
    }
    //############################JSView##########################################
    //onESResume
    try {
      appLifecycleManager.onESResume(applicationInstance);
    } catch (e) {}

    if (routerManager.isAutoRedirectEnabled()) {
      //跳转路由
      routerManager.route();
    }

    //######################################################################
  };

  const _initApplicationKeyEvent = (applicationInstance: ComponentPublicInstance) => {
    appKeyManager.init(applicationInstance);
  };
  const _initApplicationLifecycleEvent = (applicationInstance: ComponentPublicInstance) => {
    appLifecycleManager.init(app, applicationInstance);
  };
  //-------------------------------------------------------------
  app.$start().then(initCallback);

  //-----------------------------配置信息-------------------------------------------------
  const __enableModules = () => {
    return (
      typeof __ES_VUE_FEATURE_FLAGS__ === "undefined" ||
      typeof __ES_VUE_FEATURE_FLAGS__.ENABLE_MODULES === "undefined" ||
      __ES_VUE_FEATURE_FLAGS__.ENABLE_MODULES
    );
  };
  //------------------------------------------------------------------------------------
  return app as ESAppContext;
};
