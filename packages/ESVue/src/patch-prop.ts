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

/**
 * Implement the patch props method required for Vue3 VNode mount
 */
import type { ComponentInternalInstance } from "@vue/runtime-core";
import { isOn } from "@vue/shared";
import type { NeedToTyped } from "./types";

import { patchAttr } from "./modules/attrs";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/events";
import { patchStyle } from "./modules/style";
import type { HippyElement } from "./runtime/element/hippy-element";

export function patchProp(
  el: HippyElement,
  key: string,
  prevValue: NeedToTyped,
  nextValue: NeedToTyped,
  // 其余部分在大多数自定义渲染器中是不会使用的
  arg5?: any,
  arg6?: any,
  arg7?: any,
  arg8?: any,
  arg9?: any,
): void {
  // 新版 Vue 3.5+
  if (typeof arg5 === "boolean" || Array.isArray(arg6)) {
    const isSVG = arg5;
    const prevChildren = arg6;
    const parentComponent = arg7;
    const parentSuspense = arg8;
    const unmountChildren = arg9;
    // 你的实际处理逻辑在这里...
    handlePatchProp(el, key, prevValue, nextValue, parentComponent);
  } else {
    // 老版 Vue 3.4 及以下
    const namespace = arg5;
    const parentComponent = arg6;
    // 你的实际处理逻辑在这里...
    handlePatchProp(el, key, prevValue, nextValue, parentComponent);
  }
}

function handlePatchProp(
  el: NeedToTyped,
  key: string,
  prevValue: NeedToTyped,
  nextValue: NeedToTyped,
  parentComponent?: ComponentInternalInstance | null,
): void {
  // It should be noted that the values contained in prop here will have strings, numbers, arrays, objects, etc.
  switch (key) {
    case "class":
      patchClass(el, nextValue);
      break;
    case "style":
      patchStyle(el, prevValue, nextValue);
      break;
    default:
      if (isOn(key) && !isNativeEvent(key)) {
        // event prop
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      } else {
        // attribute prop
        patchAttr(el, key, prevValue, nextValue);
      }
      break;
  }
}

export function isNativeEvent(key: string) {
  return ["onInterceptTouchEvent", "onInterceptPullUpEvent"].indexOf(key) >= 0;
}
