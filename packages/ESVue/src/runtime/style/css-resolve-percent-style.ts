import { HippyElement } from "../element/hippy-element";
import { NativeNodeProps } from "../../types";

export const percentProps = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "marginTop",
  "marginLeft",
  "marginRight",
  "marginBottom",
  "paddingTop",
  "paddingLeft",
  "paddingRight",
  "paddingBottom",
];

const relativeBaseMap: Record<string, "width" | "height"> = {
  width: "width",
  left: "width",
  right: "width",
  marginLeft: "width",
  marginRight: "width",
  paddingLeft: "width",
  paddingRight: "width",
  height: "height",
  top: "height",
  bottom: "height",
  marginTop: "height",
  marginBottom: "height",
  paddingTop: "height",
  paddingBottom: "height",
};

export function resolvePercentStyles(
  node: HippyElement,
  styleObject: NativeNodeProps,
): NativeNodeProps {
  const resolved: NativeNodeProps = {};

  for (const key of Object.keys(styleObject)) {
    const val = styleObject[key];
    if (typeof val === "string" && val.endsWith("%") && percentProps.includes(key)) {
      const percent = parseFloat(val) / 100;
      const base = relativeBaseMap[key];

      // 向上找父节点确定基准值
      const baseValue = resolveBaseValueRecursive(node.parentNode as HippyElement, base);

      resolved[key] = typeof baseValue === "number" ? baseValue * percent : val; // fallback 原始字符串
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

export function resolveBaseValueRecursive(
  node: HippyElement | null,
  base: "width" | "height",
): number | undefined {
  const traceStack: HippyElement[] = [];

  while (node && node.tagName !== "es-page-view") {
    traceStack.push(node);

    const cssStyle = node.getMatchedCssStyleWithCache?.()?.normal || {};
    const inlineStyle = node.getInlineStyle?.() || {};
    const mergedStyle = { ...cssStyle, ...inlineStyle };

    const rawValue = mergedStyle[base];

    if (typeof rawValue === "number") {
      // 回填：用 setInlineStyle 设置中间节点
      for (const n of traceStack) {
        const origin = n.getInlineStyle?.() || {};
        if (typeof origin[base] !== "number") {
          n.setInlineStyle?.({ ...origin, [base]: rawValue });
        }
      }
      return rawValue;
    }

    if (typeof rawValue === "string" && rawValue.endsWith("%")) {
      const resolved = resolvePercentStyles(node, mergedStyle)[base];
      if (typeof resolved === "number") {
        for (const n of traceStack) {
          const origin = n.getInlineStyle?.() || {};
          if (typeof origin[base] !== "number") {
            n.setInlineStyle?.({ ...origin, [base]: resolved });
          }
        }
        return resolved;
      }
    }

    node = node.parentNode as HippyElement;
  }

  return undefined;
}
