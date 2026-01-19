import { camelize } from "@vue/runtime-core";
import { isString } from "@vue/shared";
import type { NeedToTyped } from "../types";
import { isNullOrUndefined } from "../util";
import { HippyElement } from "../runtime/element/hippy-element";
import { info } from "./patch-log";

// type of style
type Style = string | Record<string, string | string[]> | null | undefined;

function areStylesEqual(a: NeedToTyped, b: NeedToTyped): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b || typeof a !== "object" || typeof b !== "object") {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }

    const valA = a[key];
    const valB = b[key];

    if (valA === valB) {
      continue;
    }

    if (typeof valA === "object" && valA !== null && typeof valB === "object" && valB !== null) {
      if (!areStylesEqual(valA, valB)) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

function isStyleExisted(el: HippyElement, prev: Style, next: Style) {
  const isElementNull = !el;
  const isPrevAndNextNull = !prev && !next;
  const isPrevEqualToNext = areStylesEqual(prev, next);
  return isElementNull || isPrevAndNextNull || isPrevEqualToNext;
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
