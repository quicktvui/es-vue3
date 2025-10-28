import { ComponentPublicInstance } from "@vue/runtime-core";

export type ErrorOptions = {
  onError?: (err: unknown, instance: ComponentPublicInstance | null, info: string) => void;
  displayError?: (
    formatMessage: string,
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string,
  ) => void;
  formatError?: (err: unknown) => string;
};
