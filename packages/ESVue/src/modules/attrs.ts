import type { NeedToTyped } from "../types";
import type { HippyElement } from "../runtime/element/hippy-element";
import { info } from "./patch-log";

/**
 * set element attribute value
 *
 * @param el - element
 * @param key - key
 * @param prevValue - before value
 * @param nextValue - after value
 */
export function patchAttr(
  el: HippyElement,
  key: string,
  prevValue: NeedToTyped,
  nextValue: NeedToTyped,
): void {
  info("patchAttr: ", el, key, prevValue, nextValue);
  // set attr when next value is not equal before value
  if (prevValue !== nextValue) {
    el.setAttribute(key, nextValue);
  }
}
