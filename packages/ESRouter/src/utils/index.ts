import { RouteParams, RouteComponent, RouteParamsRaw, RouteParamValueRaw } from "../types";

export * from "./env";

export function isESModule(obj: any): obj is { default: RouteComponent } {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}

export const assign = Object.assign;

export function applyToParams(
  fn: (v: string | number | null | undefined) => string,
  params: RouteParamsRaw | undefined,
): RouteParams {
  const newParams: RouteParams = {};

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      newParams[key] = value.map((v) => applyValue(fn, v));
    } else {
      newParams[key] = applyValue(fn, value);
    }
  }
  return newParams;
}

function applyValue(fn: (v: string | number | null | undefined) => string, value: unknown): any {
  if (value == null || typeof value === "string" || typeof value === "number") {
    return fn(value);
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const result: Record<string, any> = {};
    for (const k in value) {
      result[k] = applyValue(fn, (value as Record<string, any>)[k]);
    }
    return result;
  }

  return value; // fallback: 直接返回
}

export const noop = () => {};

/**
 * Typesafe alternative to Array.isArray
 * https://github.com/microsoft/TypeScript/pull/48228
 */
export const isArray: (arg: ArrayLike<any> | any) => arg is ReadonlyArray<any> = Array.isArray;
