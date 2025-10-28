/**
 * process the rem in the style unit and return the actual size value
 *
 * @param styleObject - style
 */
import { NativeNodeProps } from "../../types";
import { parseRemStyle } from "../../util/rem";

export const remProps = [
  "fontSize",
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
  "width",
  "height",
  "lineHeight",
  "borderWidth",
  "borderRadius",
];

export function resolveRemStyles(styleObject: NativeNodeProps): NativeNodeProps {
  let style: NativeNodeProps = {};
  const keys = Object.keys(styleObject);

  if (keys.length) {
    keys.forEach((key) => {
      style[key] = parseRemStyle(styleObject[key]);
    });
  } else {
    style = styleObject;
  }

  return style;
}
