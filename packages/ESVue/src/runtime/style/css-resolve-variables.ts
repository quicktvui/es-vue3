import { warn } from "../../util/log";
import { translateColor } from "@extscreen/es3-vue-style-parser";
import { CssAttribute } from "./css-selectors-match";
import { Native } from "../native";

/**
 * 提取 CSS 中定义的变量：如 `--main-color: red;`
 */
export function extractCssVariables(rules: CssAttribute[]): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const rule of rules) {
    for (const decl of rule.declarations) {
      if (
        decl.type === "declaration" &&
        typeof decl.property === "string" &&
        decl.property.startsWith("--")
      ) {
        const varName = decl.property.trim();
        const varValue = decl.value;
        if (varValue != null && varValue != undefined) {
          variables[varName] = varValue;
        }
      }
    }
  }
  return variables;
}

/**
 * 解析css变量
 * @param value
 * @param cssVariables
 */
export function resolveVariables(
  value: any,
  cssVariables: Record<string, string>,
): string | number {
  if (typeof value === "string") {
    // 替换所有 var()
    value = resolveCssValue(value, cssVariables);
    if (typeof value === "string") {
      if (value.startsWith("calc(")) {
        value = evaluateCalcExpression(value);
      } else if (value.startsWith("clamp(")) {
        value = evaluateClamp(value);
      } else if (value.startsWith("min(")) {
        value = evaluateMin(value);
      } else if (value.startsWith("max(")) {
        value = evaluateMax(value);
      } else if (/^(rgb|rgba|hsl|hsla)\(/.test(value)) {
        value = evaluateColorFunction(value);
      }
    }
  }
  return value;
}

// 工具：解析 var() 并展开为实际值
export function resolveCssValue(
  value: string,
  cssVariables: Record<string, string | number>,
  seen: Set<string> = new Set(),
): string | number {
  const trimmed = value.trim();

  const fullVarMatch = /^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/;
  const exactMatch = trimmed.match(fullVarMatch);
  if (exactMatch) {
    const [, varName, fallback] = exactMatch;

    if (seen.has(varName)) {
      warn(`Circular reference detected in CSS variable: ${varName}`);
      return fallback?.trim() ?? "";
    }

    seen.add(varName);

    if (varName in cssVariables) {
      const resolved = cssVariables[varName];
      if (typeof resolved === "string") {
        return resolveCssValue(resolved, cssVariables, new Set(seen));
      } else {
        return resolved;
      }
    } else if (fallback != null) {
      return fallback.trim();
    } else {
      warn(`CSS variable ${varName} is not defined`);
      return "";
    }
  }

  // 含多个 var() 的情况
  const varRegex = /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g;
  return value.replace(varRegex, (_, varName, fallback) => {
    const localSeen = new Set(seen); // 👈 修复点：每个 var() 替换自己维护 seen
    if (localSeen.has(varName)) {
      warn(`Circular reference detected in CSS variable: ${varName}`);
      return fallback?.trim() ?? "";
    }
    localSeen.add(varName);

    const resolved = cssVariables[varName];
    if (resolved != null) {
      return resolveCssValue(resolved.toString(), cssVariables, localSeen).toString();
    } else if (fallback != null) {
      return fallback.trim();
    } else {
      warn(`CSS variable ${varName} is not defined`);
      return "";
    }
  });
}

// 工具：尝试计算 calc 表达式，简单实现
function evaluateCalcExpression(expr: string): string | number {
  try {
    const cleaned = expr.replace(/calc\((.+)\)/, "$1");
    // 替换单位
    const replaced = cleaned.replace(/([0-9.]+)(vw|vh|px)?/g, (_, num, unit = "") => {
      try {
        return __parseUnit(num + unit).toString();
      } catch {
        return num + unit; // 保留原值
      }
    });
    // 注意：此处 eval 存在风险，仅适用于受控源码分析，建议使用 math.js 或手写表达式求值器
    const result = Function(`"use strict"; return (${replaced})`)();
    return typeof result === "number" ? result : result;
  } catch (e) {
    warn(`Failed to evaluate calc expression: ${expr}`);
    return expr;
  }
}

function evaluateClamp(value: string): string | number {
  const match = value.match(/clamp\(\s*([^\s,]+)\s*,\s*([^\s,]+)\s*,\s*([^\s,)]+)\s*\)/);
  if (match) {
    const [_full, min, mid, max] = match;
    try {
      const result = Math.max(__parseUnit(min), Math.min(__parseUnit(max), __parseUnit(mid)));
      return result;
    } catch (e) {
      warn(`Invalid clamp values: ${value}`);
    }
  }
  return value;
}

function evaluateMin(value: string): string | number {
  const match = value.match(/min\(\s*([^\s,]+)\s*,\s*([^\s,)]+)\s*\)/);
  if (match) {
    const [_full, a, b] = match;
    return Math.min(__parseUnit(a), __parseUnit(b));
  }
  return value;
}

function evaluateMax(value: string): string | number {
  const match = value.match(/max\(\s*([^\s,]+)\s*,\s*([^\s,)]+)\s*\)/);
  if (match) {
    const [_full, a, b] = match;
    return Math.max(__parseUnit(a), __parseUnit(b));
  }
  return value;
}

function evaluateColorFunction(value: string): string | number {
  // 暂不解析颜色，直接返回原值，例如 rgba(255,0,0,0.5)
  try {
    const color = translateColor(value);
    return color;
  } catch (e) {
    console.error(e);
  }
  return value;
}

function __parseUnit(value: string): number {
  const vw = Native.Dimensions.screen.width * Native.Dimensions.screen.scale;
  const vh = Native.Dimensions.screen.height * Native.Dimensions.screen.scale;

  if (value.endsWith("vw")) {
    return (parseFloat(value) / 100) * vw;
  } else if (value.endsWith("vh")) {
    return (parseFloat(value) / 100) * vh;
  } else if (value.endsWith("px")) {
    return parseFloat(value);
  } else if (!isNaN(parseFloat(value))) {
    return parseFloat(value); // 无单位，直接数值
  } else {
    throw new Error(`Unsupported unit: ${value}`);
  }
}
