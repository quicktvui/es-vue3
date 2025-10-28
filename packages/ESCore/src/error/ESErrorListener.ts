import { ComponentPublicInstance } from "@vue/runtime-core";

export interface ESErrorListener {
  onError(err: unknown, instance: ComponentPublicInstance | null, info: string): void;
}
