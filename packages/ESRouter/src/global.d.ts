// Global compile-time constants
import { Component } from "vue";

declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var __FEATURE_PROD_DEVTOOLS__: boolean;
declare var __BROWSER__: boolean;
declare var __NODE_JS__: boolean;
declare var __CI__: boolean;

//
declare const __ES_ROUTER_FEATURE_FLAGS__: Partial<{
  ROOT_VIEW_COMPONENT_NAME: string;
  PAGE_VIEW_COMPONENT_NAME: string;
}>;
