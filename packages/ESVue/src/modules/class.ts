import type { HippyElement } from "../runtime/element/hippy-element";
import { info } from "./patch-log";

/**
 * Set the class attribute to an element
 *
 * @param el - element
 * @param newValue - new value
 */
export function patchClass(el: HippyElement, newValue: string): void {
  let value = newValue;

  info("patchClass: ", el, newValue);

  if (value === null) {
    value = "";
  }

  // directly setting className should be faster than setAttribute in theory
  // if this is an element during a transition, take the temporary transition classes into account.
  // the animation class will be processed later
  // const transitionClasses = (el as ElementWithTransition)._vtc;
  const transitionClasses = "";
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }

  el.setAttribute("class", value);
}
