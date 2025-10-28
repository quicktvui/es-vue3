/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2022 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CssDeclarationType,
  CssNodeType,
  parseCSS,
  translateColor,
} from "@extscreen/es3-vue-style-parser";
import { App, Component, createRenderer } from "@vue/runtime-core";
import { isFunction } from "@vue/shared";

import type { CallbackType, CommonMapParams, NativeInterfaceMap, NeedToTyped } from "./types";
import BuiltInComponent from "./built-in-component";
import { nodeOps } from "./node-ops";
import { patchProp } from "./patch-prop";
import {
  ElementComponent,
  getTagComponent,
  registerElement,
  TagComponent,
} from "./runtime/component";
import { HippyDocument } from "./runtime/document/hippy-document";
import type { HippyElement } from "./runtime/element/hippy-element";
import type { HippyInputElement } from "./runtime/element/hippy-input-element";
import type { HippyListElement } from "./runtime/element/hippy-list-element";
import { EventBus } from "./runtime/event/event-bus";
import type { NativeApiType } from "./runtime/native";
import { Native } from "./runtime/native";
import "./runtime/event/hippy-event-dispatcher";
import "./runtime/websocket/websocket";
import type { HippyNode } from "./runtime/node/hippy-node";
import {
  setBeforeLoadStyle,
  setBeforeRenderToNative,
  setSilent,
  setTrimWhitespace,
  trace,
} from "./util";
import type { HippyCachedInstanceType } from "./util/instance";
import {
  getHippyCachedInstance,
  setHippyCachedInstance,
  setHippyCachedInstanceParams,
} from "./util/instance";
import { setScreenSize } from "./util/screen";
import { setLoggerDebug } from "./util/log";

/**
 * Hippy App type, override the mount method of Vue
 *
 */
export type ESApp = App & {
  $start: (
    afterCallback?: CallbackType,
  ) => Promise<{ superProps: NeedToTyped; rootViewId: number }>;

  exit(code?: number);
};

/**
 * options type of initialization parameters
 */
export interface ESAppOptions {
  // The app name registered by the Hippy native needs to be applied to the Hippy party
  appName?: string;
  // style configuration
  styleOptions?: {
    // hook method for style loading
    beforeLoadStyle?: (decl: CssDeclarationType) => CssDeclarationType;
    // base screen width, the default value is 750, which is usually used in the design draft.
    ratioBaseWidth?: number;
    // base rem
    remBase?: number;
  };
  // do not print trace info if set to true
  silent?: boolean;
  debug?: boolean;
  // set whether to trim text whitespace
  trimWhitespace?: boolean;
}

// base screen width
const defaultRatioBaseWidth = 1920;
//
const defaultRemBase = 16;

const componentName = [
  "%c[Hippy-Vue-Next]%c",
  "color: #4fc08d; font-weight: bold",
  "color: auto; font-weight: auto",
];

/**
 * create root node
 */
function createRootNode(rootContainer: string): HippyNode {
  // Create the root node as the root of the entire hippy tree
  const root: HippyElement = HippyDocument.createElement("div");
  // The id value of the root node is set to the incoming parameter rootContainer
  root.id = rootContainer;
  // The root node flex is set to 1 by default
  root.style.flex = 1;

  return root;
}

/**
 * Create Hippy Vue instance
 *
 * @param vueRootComponent - instance of vue root component
 * @param options - initialization parameters
 *
 * @public
 */
export const createApp = (vueRootComponent: Component, options: ESAppOptions): ESApp => {
  // createRenderer ---> vue
  // Create a custom renderer and get the vue app instance
  const app: App = createRenderer({
    //
    //RendererOptions
    //https://cn.vuejs.org/api/custom-renderer
    patchProp, //
    ...nodeOps, //
  }).createApp(vueRootComponent);
  // hippy app instance
  const hippyApp: ESApp = app as ESApp;

  // register built-in label components, such as div, span, etc., to enable HippyNode to support built-in labels
  // these built-in tags will be converted to component types recognized by Native,
  // registered with default properties, added additional event processing, etc.
  hippyApp.use(BuiltInComponent);

  if (typeof options?.styleOptions?.beforeLoadStyle === "function") {
    // If a style loading hook is set, save the custom style loading hook
    setBeforeLoadStyle(options.styleOptions.beforeLoadStyle);
  }

  // do not print trace info
  if (options.silent != undefined) {
    setSilent(options.silent);
  }

  //
  if (options.debug != undefined) {
    setLoggerDebug(options.debug);
  }

  // set whether to trim whitespace
  setTrimWhitespace(options.trimWhitespace);

  // save the original mount method
  const { mount } = hippyApp;

  // rewrite mount method of vue
  hippyApp.mount = (rootContainer) => {
    // cache rootContainer, used to determine whether it is the root node
    setHippyCachedInstanceParams("rootContainer", rootContainer);
    // create the root node
    const root = createRootNode(rootContainer);
    // mount and get the instance
    const instance = mount(root, false, false);
    // cache Vue instance
    setHippyCachedInstanceParams("instance", instance);

    return instance;
  };

  // return instance of HippyApp instance
  hippyApp.$start = async (afterCallback?: CallbackType) =>
    new Promise((resolve) => {
      // call the interface provided by Native to register hippy
      Native.hippyNativeRegister.regist(options.appName, (superProps: NeedToTyped) => {
        // get the initialization parameters passed in by the native, login parameters
        const { __instanceId__: rootViewId } = superProps;

        trace(
          ...componentName,
          "Start",
          options.appName,
          "with rootViewId",
          rootViewId,
          superProps,
        );
        // when refreshing the app, need to remove the old instance first
        const oldInstance = getHippyCachedInstance();
        if (oldInstance?.app) {
          oldInstance.app.unmount();
        }

        // cache initialization parameters
        setHippyCachedInstance({
          rootViewId, // id of root view returned by native, do not forget set style for root view
          superProps, // initialization parameters returned by native
          app: hippyApp,
          ratioBaseWidth: options?.styleOptions?.ratioBaseWidth ?? defaultRatioBaseWidth, // base screen width
          remBase: options?.styleOptions?.remBase ?? defaultRemBase,
        });

        const globalInitParams = {
          superProps,
          rootViewId,
        };

        // the initialization is complete, and return the initialization parameters returned
        // by native. support callback && promise
        if (isFunction(afterCallback)) {
          afterCallback(globalInitParams);
        } else {
          resolve(globalInitParams);
        }
      });
    });

  hippyApp.exit = (code) => {
    try {
      if (code != undefined) {
        if (code == 0) {
          console.log("[Quick TV App Exit] Exit code:", code);
        } else {
          console.error("[Quick TV App Exit] Exit code:", code);
        }
      } else {
        console.log("[Quick TV App Exit] Exit!");
      }
    } catch (e) {}
    Native.callNative("EsNativeModule", "finish");
  };

  hippyApp.directive("pseudo", {
    mounted(el: HippyElement, binding) {
      const pseudo = binding.arg;
      if (pseudo) {
        const value = binding.value;
        el.setPseudoState(pseudo, value);
      }
    },
    updated(el: HippyElement, binding) {
      const pseudo = binding.arg;
      if (pseudo) {
        const value = binding.value;
        el.setPseudoState(pseudo, value);
      }
    },
  });

  // return hippy vue instance
  return hippyApp;
};

/*
 * used to validate beforeRenderToNative hook
 * when ElementNode or ViewNode have breaking changes, add version number to disable
 * beforeRenderToNative hook
 */
const BEFORE_RENDER_TO_NATIVE_HOOK_VERSION = 1;
export const _setBeforeRenderToNative = (hook, version) => {
  if (isFunction(hook)) {
    if (BEFORE_RENDER_TO_NATIVE_HOOK_VERSION === version) {
      setBeforeRenderToNative(hook);
    } else {
      console.error("_setBeforeRenderToNative API had changed, the hook function will be ignored!");
    }
  }
};

export type {
  NativeApiType,
  HippyCachedInstanceType,
  HippyElement,
  HippyNode,
  HippyInputElement,
  HippyListElement,
  CssNodeType,
  TagComponent,
  ElementComponent,
  CallbackType,
  CommonMapParams,
  NeedToTyped,
  NativeInterfaceMap,
};

export {
  HIPPY_DEBUG_ADDRESS,
  HIPPY_STATIC_PROTOCOL,
  NATIVE_COMPONENT_MAP,
  IS_PROD,
  HIPPY_GLOBAL_STYLE_NAME,
  HIPPY_GLOBAL_DISPOSE_STYLE_NAME,
  HIPPY_VUE_VERSION,
} from "./config";
export {
  HippyEvent,
  HippyTouchEvent,
  HippyKeyboardEvent,
  HippyLayoutEvent,
  HippyLoadResourceEvent,
  ExposureEvent,
  FocusEvent,
  ContentSizeEvent,
  ListViewEvent,
  ViewPagerEvent,
  eventIsKeyboardEvent,
  //-----------add by liulipeng-----------------------------
  BindEvent,
  HippyScrollOffsetEvent,
  HippyScrollStateChangedEvent,
  HippyChildFocusEvent,
  HippyChildSelectEvent,
  HippyFocusSearchFailedEvent,
  //-----------add by liulipeng-----------------------------
} from "./runtime/event/hippy-event";

export {
  EventBus,
  Native,
  translateColor,
  parseCSS,
  setScreenSize,
  getTagComponent,
  registerElement,
};

export * from "./hooks/lifecycle";
