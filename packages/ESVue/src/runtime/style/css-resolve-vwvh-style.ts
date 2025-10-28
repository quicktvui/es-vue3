// 可按需添加你希望支持 vw/vh 的属性
import { NativeNodeProps } from "../../types";
import type { NeedToTyped } from "../../types";
import { Native } from "../native";

export const vwvhProps = [
  "width",
  "height",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "top",
  "left",
  "right",
  "bottom",
  "fontSize",
  "lineHeight",
  "borderWidth",
  "borderRadius",
];

export function resolveVwVhStyles(styleObject: NativeNodeProps): NativeNodeProps {
  let style: NativeNodeProps = {};
  const keys = Object.keys(styleObject);

  if (keys.length) {
    keys.forEach((key) => {
      style[key] = parseVwVhStyle(styleObject[key]);
    });
  } else {
    style = styleObject;
  }

  return style;
}

export function parseVwVhStyle(styleValue: NeedToTyped): NeedToTyped {
  if (typeof styleValue !== "string") {
    return styleValue;
  }

  const vwMatch = styleValue.match(/^([\d.]+)vw$/);
  const vhMatch = styleValue.match(/^([\d.]+)vh$/);

  if (vwMatch) {
    const vw = parseFloat(vwMatch[1]);
    const { width } = Native.Dimensions.screen;
    return (vw / 100) * width * Native.Dimensions.screen.scale;
  }

  if (vhMatch) {
    const { height } = Native.Dimensions.screen;
    const vh = parseFloat(vhMatch[1]);
    return (vh / 100) * height * Native.Dimensions.screen.scale;
  }

  return styleValue;
}
