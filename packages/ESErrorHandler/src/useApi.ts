import { inject, InjectionKey } from "vue";
import { ESErrorHandler } from "./core/ESErrorHandler";

export const ESErrorHandlerKey = Symbol("ESErrorHandlerKey") as InjectionKey<ESErrorHandler>;

export function useESErrorHandler(): ESErrorHandler {
  return inject(ESErrorHandlerKey)!;
}
