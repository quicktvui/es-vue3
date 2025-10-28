import { HippyElement } from "../element/hippy-element";
import { NativeNodeProps } from "../../types";
import { resolveBaseValueRecursive } from "./css-resolve-percent-style";

/**
 * 解析auto
 */
export function resolveAutoStyles(
  node: HippyElement,
  styleObject: NativeNodeProps,
): NativeNodeProps {
  const resolved: NativeNodeProps = {};

  // 展开 margin: auto 成四个方向
  if (styleObject.margin === "auto") {
    styleObject.marginTop = "auto";
    styleObject.marginRight = "auto";
    styleObject.marginBottom = "auto";
    styleObject.marginLeft = "auto";
    delete styleObject.margin;
  }

  for (const key of Object.keys(styleObject)) {
    const val = styleObject[key];
    if (val !== "auto") {
      resolved[key] = val;
      continue;
    }

    switch (key) {
      case "width":
      case "height": {
        const parentBase = resolveBaseValueRecursive(node.parentNode as HippyElement, key);
        let size = typeof parentBase === "number" ? parentBase : 0;

        // 读取 min/max 限制
        const minKey = key === "width" ? "minWidth" : "minHeight";
        const maxKey = key === "width" ? "maxWidth" : "maxHeight";
        const min = getResolvedStyleValue(node, minKey);
        const max = getResolvedStyleValue(node, maxKey);
        if (typeof min === "number" && size < min) {
          size = min;
        }
        if (typeof max === "number" && size > max) {
          size = max;
        }
        resolved[key] = size;
        node.updateInlineStyle({ [key]: size });
        break;
      }

      case "marginLeft":
      case "marginRight": {
        const width = getResolvedStyleValue(node, "width");
        const parentWidth = resolveBaseValueRecursive(node.parentNode as HippyElement, "width");
        if (typeof width === "number" && typeof parentWidth === "number") {
          const space = (parentWidth - width) / 2;
          resolved.marginLeft = space;
          resolved.marginRight = space;
        } else {
          resolved[key] = 0;
        }
        break;
      }

      case "marginTop":
      case "marginBottom": {
        const height = getResolvedStyleValue(node, "height");
        const parentHeight = resolveBaseValueRecursive(node.parentNode as HippyElement, "height");
        if (typeof height === "number" && typeof parentHeight === "number") {
          const space = (parentHeight - height) / 2;
          resolved.marginTop = space;
          resolved.marginBottom = space;
        } else {
          resolved[key] = 0;
        }
        break;
      }

      case "top":
      case "left":
      case "right":
      case "bottom":
        resolved[key] = 0;
        break;

      case "flexBasis":
        resolved[key] = 0;
        break;

      default:
        console.warn(`[resolveAutoStyles] unsupported auto style "${key}"`);
        resolved[key] = 0;
        break;
    }
  }
  return resolved;
}

function getResolvedStyleValue(node: HippyElement, key: string): number | undefined {
  const css = node.getMatchedCssStyleWithCache?.()?.normal ?? {};
  const inline = node.getInlineStyle?.() ?? {};
  const value = inline[key] ?? css[key];

  if (typeof value === "number") return value;
  return undefined;
}
