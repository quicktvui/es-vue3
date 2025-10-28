import { HippyElement } from "../element/hippy-element";
import { NativeNodeProps } from "../../types";

export function resolveWidthHeightStyles(
  node: HippyElement,
  styleObject: NativeNodeProps,
): NativeNodeProps {
  // const resolved: NativeNodeProps = {...styleObject};
  // const hasWidth = resolved.width != null;
  // const hasHeight = resolved.height != null;
  // if (!hasWidth) {
  //   resolved.width = 'auto';
  // }
  // if (!hasHeight) {
  //   resolved.height = 'auto';
  // }
  return styleObject;
}
