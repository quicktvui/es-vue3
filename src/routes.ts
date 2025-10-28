import splash from "./views/splash/es-splash-page";
import index from "./views/index.vue";
import error from "./views/error";
import test from "./views/test";
import ESAPINavPageList from "./views/nav";
//---------------------------------------------------------------------------------
import ESRouterESList from "./components/es-router/es";
import ESRouterLimitList from "./components/es-router/limit";
import ESNativeRouterPageList from "./components/es-router/native";
import ESRouterIssuesPageList from "./components/es-router/issues";
//---------------------------------------------------------------------------------

import ESFlexDirectionPageList from "./components/es-flex/direction";
import ESFlexWrapPageList from "./components/es-flex/wrap";
import ESFlexJustifyContentPageList from "./components/es-flex/justify-content";
import ESFlexAlignItemsPageList from "./components/es-flex/align-items";
import ESFlexAlignContentPageList from "./components/es-flex/align-content";
import ESPageLifecycleList from "./components/es-lifecycle";
import ESPageDialogList from "./components/es-dialog";
import ESModulePageList from "./components/es-module";
import ESLogPageList from "./components/es-log";
import ESXLogPageList from "./components/es-xlog";
import ESKeyPageList from "./components/es-key";
import ESNetworkPageList from "./components/es-network";
import ESVideoPlayerPageList from "./components/es-video-player";
import ESPlayerManagerPageList from "./components/es-player-manager";
import ESADPlayerPageList from "./components/es-ad-player";
import ESAudioPlayerPageList from "./components/es-audio-player";
import ESAudioServicePlayerPageList from "./components/es-audio-service-player";
import ESSoundPoolPlayerPageList from "./components/es-sound-pool-player";
import ESEventBusPageList from "./components/es-eventbus";
import EsUlList from "./components/es-ul";
import ESComponentPageList from "./components/es-component";
import ESUtilsPageList from "./components/es-utils";
import ESJSViewPageList from "./components/es-js-view";
import ESSlotPageList from "./components/es-slot";
import ESWorkerPageList from "./components/es-worker";
import ESDynamicImportPageList from "./components/es-dynamic-import";
import ESAxiosPageList from "./components/es-axios";
import ESAndroidHttpServerList from "./components/es-local-http-server";
import ESStylePageList from "./components/es-style";
import ESStyleTransformPageList from "./components/es-style/transform";
import ESStyleFlexPageList from "./components/es-style/flex";
import ESStyleAnimationPageList from "./components/es-style/animation";
import ESAnimationPageList from "./components/es-animation";

//--------------------------------CSS-------------------------------------------
import ESCSSPageList from "./components/es-css";
import ESCSSBorderPageList from "./components/es-css/border";
import ESCSSBackgroundImagePageList from "./components/es-css/background-image";
import ESCSSBackgroundPageList from "./components/es-css/background";
import ESCSSGradientBackgroundPageList from "./components/es-css/gradient-background";
import ESCSSSelectorPageList from "./components/es-css/selector";
import ESCSSVariablePageList from "./components/es-css/variable";
import ESCSSPseudoClassesPageList from "./components/es-css/pseudo-classes";
import ESCSSAutoPageList from "./components/es-css/auto";
import ESCSSPercentagePageList from "./components/es-css/percentage";
import ESCSSViewportPageList from "./components/es-css/viewport";
import ESCSSNamePageList from "./components/es-css/name";
import ESCSSRemPageList from "./components/es-css/rem";
import ESCSSImportantPageList from "./components/es-css/important";
import ESCSSMaxWidthPageList from "./components/es-css/max-width";
//-----------------------------性能----------------------------------------------
import ESPerformancePageList from "./components/es-performance";
//-----------------------------主题----------------------------------------------
//
import ESThemePageList from "./components/es-theme";

//#################################### JSView ####################################################
import es_slot_back from "./components/es-js-view/es-js-view-back.vue";
import es_slot_event from "./components/es-js-view/es-js-view-event.vue";
import es_slot_key from "./components/es-js-view/es-js-view-key.vue";
import es_slot_lifecycle from "./components/es-js-view/es-js-view-lifecycle.vue";
import es_slot_module_device from "./components/es-js-view/es-js-view-module-device.vue";
import es_slot_suspend from "./components/es-js-view/es-js-view-suspend.vue";
//##################################### JSView ###################################################

// const test = () => require("./views/test.vue");
// import test from "./views/test";
import { defineAsyncComponent } from "vue";
// const _import = () => defineAsyncComponent(() => import('./views/test.vue'));

//#################################### QT ####################################################
import QtModulePageList from "./components/qt-module";
import QtComponentPageList from "./components/qt-component";
//#################################### JSView ####################################################

import { ESRouteLaunchMode } from "@extscreen/es3-router";

const routes = [
  {
    path: "/splash",
    name: "splash",
    component: splash,
    launchMode: "standard",
  },
  {
    path: "/index",
    name: "index",
    component: index,
    launchMode: ESRouteLaunchMode.ES_ROUTE_LAUNCH_MODE_CLEAR_TASK,
  },
  {
    path: "/async-component",
    name: "async-component",
    component: () => import("./views/async/index.vue"),
    launchMode: "standard",
  },
  {
    path: "/error",
    name: "error",
    component: error,
    launchMode: "standard",
  },
  {
    path: "/test",
    name: "test",
    component: test,
    launchMode: "standard",
  },
  //############################# JSView路由 ###########################################
  {
    path: "/slot_back",
    name: "slot_back",
    component: es_slot_back,
  },
  {
    path: "/slot_event",
    name: "slot_event",
    component: es_slot_event,
  },
  {
    path: "/slot_key",
    name: "slot_key",
    component: es_slot_key,
  },
  {
    path: "/slot_lifecycle",
    name: "slot_lifecycle",
    component: es_slot_lifecycle,
  },
  {
    path: "/slot_module_device",
    name: "slot_module_device",
    component: es_slot_module_device,
  },
  {
    path: "/slot_suspend",
    name: "slot_suspend",
    component: es_slot_suspend,
    props: {
      suspend: false,
    },
  },
  //################################ JSView路由 ########################################
  ...Object.keys(ESAPINavPageList).map((item) => ({
    path: `/nav/${item}`,
    name: `nav/${item}`,
    component: ESAPINavPageList[item].component,
  })),
  //-----------------------------------------------------------------------------
  ...Object.keys(ESRouterESList).map((item) => ({
    path: `/router/${item}`,
    name: `router/${item}`,
    component: ESRouterESList[item].component,
    type: ESRouterESList[item].type,
    launchMode: ESRouterESList[item].launchMode,
  })),
  ...Object.keys(ESNativeRouterPageList).map((item) => ({
    path: `/router/${item}`,
    name: `router/${item}`,
    component: ESNativeRouterPageList[item].component,
  })),
  ...Object.keys(ESRouterLimitList).map((item) => ({
    path: `/router/${item}`,
    name: `router/${item}`,
    component: ESRouterLimitList[item].component,
  })),
  ...Object.keys(ESRouterIssuesPageList).map((item) => ({
    path: `/${item}`,
    name: `${item}`,
    component: ESRouterIssuesPageList[item].component,
    type: ESRouterIssuesPageList[item].type,
    launchMode: ESRouterIssuesPageList[item].launchMode,
  })),
  //-----------------------------------------------------------------------------
  ...Object.keys(ESFlexDirectionPageList).map((item) => ({
    path: `/flex/${item}`,
    name: `flex/${item}`,
    component: ESFlexDirectionPageList[item].component,
  })),
  ...Object.keys(ESFlexWrapPageList).map((item) => ({
    path: `/flex/${item}`,
    name: `flex/${item}`,
    component: ESFlexWrapPageList[item].component,
  })),
  ...Object.keys(ESFlexJustifyContentPageList).map((item) => ({
    path: `/flex/${item}`,
    name: `flex/${item}`,
    component: ESFlexJustifyContentPageList[item].component,
  })),
  ...Object.keys(ESFlexAlignItemsPageList).map((item) => ({
    path: `/flex/${item}`,
    name: `flex/${item}`,
    component: ESFlexAlignItemsPageList[item].component,
  })),
  ...Object.keys(ESFlexAlignContentPageList).map((item) => ({
    path: `/flex/${item}`,
    name: `flex/${item}`,
    component: ESFlexAlignContentPageList[item].component,
  })),
  ...Object.keys(ESPageLifecycleList).map((item) => ({
    path: `/lifecycle/${item}`,
    name: `lifecycle/${item}`,
    component: ESPageLifecycleList[item].component,
  })),
  ...Object.keys(ESPageDialogList).map((item) => ({
    path: `/dialog/${item}`,
    name: `dialog/${item}`,
    component: ESPageDialogList[item].component,
    type: ESPageDialogList[item].type,
  })),
  ...Object.keys(ESModulePageList).map((item) => ({
    path: `/module/${item}`,
    name: `module/${item}`,
    component: ESModulePageList[item].component,
  })),
  ...Object.keys(QtModulePageList).map((item) => ({
    path: `/module/${item}`,
    name: `module/${item}`,
    component: QtModulePageList[item].component,
  })),
  ...Object.keys(ESComponentPageList).map((item) => ({
    path: `/component/${item}`,
    name: `component/${item}`,
    component: ESComponentPageList[item].component,
  })),
  ...Object.keys(QtComponentPageList).map((item) => ({
    path: `/component/${item}`,
    name: `component/${item}`,
    component: QtComponentPageList[item].component,
  })),
  ...Object.keys(ESLogPageList).map((item) => ({
    path: `/log/${item}`,
    name: `log/${item}`,
    component: ESLogPageList[item].component,
  })),
  ...Object.keys(ESXLogPageList).map((item) => ({
    path: `/xlog/${item}`,
    name: `xlog/${item}`,
    component: ESXLogPageList[item].component,
  })),
  ...Object.keys(ESKeyPageList).map((item) => ({
    path: `/key/${item}`,
    name: `key/${item}`,
    component: ESKeyPageList[item].component,
  })),
  ...Object.keys(ESNetworkPageList).map((item) => ({
    path: `/network/${item}`,
    name: `network/${item}`,
    component: ESNetworkPageList[item].component,
  })),
  ...Object.keys(ESVideoPlayerPageList).map((item) => ({
    path: `/video/${item}`,
    name: `video/${item}`,
    component: ESVideoPlayerPageList[item].component,
  })),
  ...Object.keys(ESAudioPlayerPageList).map((item) => ({
    path: `/audio/${item}`,
    name: `audio/${item}`,
    component: ESAudioPlayerPageList[item].component,
  })),
  ...Object.keys(ESAudioServicePlayerPageList).map((item) => ({
    path: `/audio-service/${item}`,
    name: `audio-service/${item}`,
    component: ESAudioServicePlayerPageList[item].component,
  })),
  ...Object.keys(ESSoundPoolPlayerPageList).map((item) => ({
    path: `/sound-pool/${item}`,
    name: `sound-pool/${item}`,
    component: ESSoundPoolPlayerPageList[item].component,
  })),
  ...Object.keys(ESADPlayerPageList).map((item) => ({
    path: `/ad/${item}`,
    name: `ad/${item}`,
    component: ESADPlayerPageList[item].component,
  })),
  ...Object.keys(ESPlayerManagerPageList).map((item) => ({
    path: `/player-manager/${item}`,
    name: `player-manager/${item}`,
    component: ESPlayerManagerPageList[item].component,
  })),
  ...Object.keys(ESEventBusPageList).map((item) => ({
    path: `/eventbus/${item}`,
    name: `eventbus/${item}`,
    component: ESEventBusPageList[item].component,
  })),
  ...Object.keys(EsUlList).map((item) => ({
    path: `/ul/${item}`,
    name: `ul/${item}`,
    component: EsUlList[item].component,
  })),
  ...Object.keys(ESUtilsPageList).map((item) => ({
    path: `/utils/${item}`,
    name: `utils/${item}`,
    component: ESUtilsPageList[item].component,
  })),
  ...Object.keys(ESJSViewPageList).map((item) => ({
    path: `/js-view/${item}`,
    name: `js-view/${item}`,
    component: ESJSViewPageList[item].component,
  })),
  ...Object.keys(ESWorkerPageList).map((item) => ({
    path: `/worker/${item}`,
    name: `worker/${item}`,
    component: ESWorkerPageList[item].component,
  })),
  ...Object.keys(ESDynamicImportPageList).map((item) => ({
    path: `/dynamic-import/${item}`,
    name: `dynamic-import/${item}`,
    component: ESDynamicImportPageList[item].component,
  })),
  {
    path: "/dynamic-import/composition",
    name: "dynamic-import/composition",
    component: () =>
      import("./components/es-dynamic-import/es-dynamic-import-composition-page.vue"),
    launchMode: "standard",
  },
  {
    path: "/dynamic-import/setup",
    name: "dynamic-import/setup",
    component: () => import("./components/es-dynamic-import/es-dynamic-import-setup-page.vue"),
    launchMode: "standard",
  },
  ...Object.keys(ESAxiosPageList).map((item) => ({
    path: `/axios/${item}`,
    name: `axios/${item}`,
    component: ESAxiosPageList[item].component,
  })),
  ...Object.keys(ESAndroidHttpServerList).map((item) => ({
    path: `/httpserver/${item}`,
    name: `httpserver/${item}`,
    component: ESAndroidHttpServerList[item].component,
  })),
  ...Object.keys(ESSlotPageList).map((item) => ({
    path: `/slot/${item}`,
    name: `slot/${item}`,
    component: ESSlotPageList[item].component,
  })),
  //-----------------------------------------------------------
  ...Object.keys(ESStylePageList).map((item) => ({
    path: `/style/${item}`,
    name: `style/${item}`,
    component: ESStylePageList[item].component,
  })),
  ...Object.keys(ESStyleTransformPageList).map((item) => ({
    path: `/style/${item}`,
    name: `style/${item}`,
    component: ESStyleTransformPageList[item].component,
  })),
  ...Object.keys(ESStyleFlexPageList).map((item) => ({
    path: `/style/${item}`,
    name: `style/${item}`,
    component: ESStyleFlexPageList[item].component,
  })),
  ...Object.keys(ESStyleAnimationPageList).map((item) => ({
    path: `/style/${item}`,
    name: `style/${item}`,
    component: ESStyleAnimationPageList[item].component,
  })),
  //-----------------------------css------------------------------
  ...Object.keys(ESCSSPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSPageList[item].component,
  })),
  ...Object.keys(ESCSSBorderPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSBorderPageList[item].component,
  })),
  ...Object.keys(ESCSSBackgroundImagePageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSBackgroundImagePageList[item].component,
  })),
  ...Object.keys(ESCSSBackgroundPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSBackgroundPageList[item].component,
  })),
  ...Object.keys(ESCSSGradientBackgroundPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSGradientBackgroundPageList[item].component,
  })),
  ...Object.keys(ESCSSSelectorPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSSelectorPageList[item].component,
  })),
  ...Object.keys(ESCSSVariablePageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSVariablePageList[item].component,
  })),
  ...Object.keys(ESCSSPseudoClassesPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSPseudoClassesPageList[item].component,
  })),
  ...Object.keys(ESCSSAutoPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSAutoPageList[item].component,
  })),
  ...Object.keys(ESCSSMaxWidthPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSMaxWidthPageList[item].component,
  })),
  ...Object.keys(ESCSSPercentagePageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSPercentagePageList[item].component,
  })),
  ...Object.keys(ESCSSViewportPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSViewportPageList[item].component,
  })),
  ...Object.keys(ESCSSNamePageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSNamePageList[item].component,
  })),
  ...Object.keys(ESCSSRemPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSRemPageList[item].component,
  })),
  ...Object.keys(ESCSSImportantPageList).map((item) => ({
    path: `/css/${item}`,
    name: `css/${item}`,
    component: ESCSSImportantPageList[item].component,
  })),
  ...Object.keys(ESThemePageList).map((item) => ({
    path: `/theme/${item}`,
    name: `theme/${item}`,
    component: ESThemePageList[item].component,
  })),
  ...Object.keys(ESAnimationPageList).map((item) => ({
    path: `/animation/${item}`,
    name: `animation/${item}`,
    component: ESAnimationPageList[item].component,
  })),
  //--------------------------------性能测试-----------------------------------------------
  ...Object.keys(ESPerformancePageList).map((item) => ({
    path: `/performance/${item}`,
    name: `performance/${item}`,
    component: ESPerformancePageList[item].component,
  })),
];

export default routes;
