import { HippyElement } from "../element/hippy-element";
import { NativeNodeProps } from "../../types";
import { resolveRemStyles } from "./css-resolve-rem-style";
import { resolvePercentStyles } from "./css-resolve-percent-style";
import { resolveVwVhStyles } from "./css-resolve-vwvh-style";
import { resolveAutoStyles } from "./css-resolve-auto-style";
import { resolveWidthHeightStyles } from "./css-resolve-width-height-style";

export function resolveStyle(node: HippyElement, styleObject: NativeNodeProps): NativeNodeProps {
  // 1. 先处理其他单位（px、pt、auto、vw 等）
  // 2. 基于 parentResolvedStyle 处理百分比样式
  // finally, get the style from the style attribute of the node and process the rem unit

  const remStyles = resolveRemStyles(styleObject);
  const vwvhStyles = resolveVwVhStyles(remStyles);
  const widthHeightStyles = resolveWidthHeightStyles(node, vwvhStyles);
  const autoStyles = resolveAutoStyles(node, widthHeightStyles);
  const percentStyles = resolvePercentStyles(node, autoStyles);

  return percentStyles;
}
