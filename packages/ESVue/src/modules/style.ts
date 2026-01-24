import { camelize } from "@vue/runtime-core";
import { isString } from "@vue/shared";
import type { NeedToTyped } from "../types";
import { isNullOrUndefined } from "../util";
import { HippyElement } from "../runtime/element/hippy-element";
import { info } from "./patch-log";

// type of style
type Style = string | Record<string, string | string[]> | null | undefined;

/**
 * Compare two style objects for structural equality.
 * Faster than JSON.stringify and order-independent.
 *
 * @param prev - old value
 * @param next - new value
 */
export function areStylesEqual(prev: NeedToTyped, next: NeedToTyped): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if (typeof prev !== "object" || typeof next !== "object") return false;

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (next[key] === undefined && !Object.prototype.hasOwnProperty.call(next, key)) {
      return false;
    }
    const pVal = prev[key];
    const nVal = next[key];

    if (pVal === nVal) continue;

    if (typeof pVal === "object" && pVal !== null && typeof nVal === "object" && nVal !== null) {
      if (!areStylesEqual(pVal, nVal)) return false;
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
