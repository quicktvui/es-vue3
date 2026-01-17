import { camelize } from "@vue/runtime-core";
import { isString } from "@vue/shared";
import type { NeedToTyped } from "../types";
import { isNullOrUndefined } from "../util";
import { HippyElement } from "../runtime/element/hippy-element";
import { info } from "./patch-log";

// type of style
export type Style = string | Record<string, string | string[]> | null | undefined;

export function isStyleExisted(el: HippyElement, prev: Style, next: Style) {
  if (!el) {
    return true;
  }
  if (!prev && !next) {
    return true;
  }
  if (prev === next) {
    return true;
  }
  if (!prev || !next) {
    return false;
  }
  return areStylesEqual(prev, next);
}

function areStylesEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!areStylesEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (Array.isArray(b)) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!areStylesEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

/**
 * set the Style property
 *
 * @param rawEl - target element
 * @param prev - old value
 * @param next - new value
 */
export function patchStyle(rawEl: HippyElement, prev: Style, next: Style): void {
  const el = rawEl;
  const batchedStyles: NeedToTyped = {};

  if (isStyleExisted(el, prev, next)) {
    // if the previous and next attributes are the same, skip the patch calculation.
    return;
  }

  info("patchStyle: ", rawEl, prev, next);

  if (prev && !next) {
    // clear style
    el.removeInlineStyle();
  } else if (isString(next)) {
    // in hippy, the styles are all array or Object types, and if it is a string, thrown an exception
    throw new Error("Style is Not Object");
  } else if (next) {
    // the new style is an array or Object, apply the new style to all
    // style is an array, so we do not update native instantly, we will update at the end
    Object.keys(next).forEach((key) => {
      const value = next[key];
      if (!isNullOrUndefined(value)) {
        batchedStyles[camelize(key)] = value;
      }
    });
    // 如果 prev 和 batchedStyles 内容一致，跳过更新
    const isStyleChanged =
      !prev ||
      Object.keys(batchedStyles).some((key) => batchedStyles[key] !== prev[key]) ||
      Object.keys(prev).some((key) => batchedStyles[key] === undefined);

    if (isStyleChanged) {
      el.removeInlineStyle(true);
      el.setInlineStyle(batchedStyles);
    }
  }
}
