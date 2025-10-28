<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-view :text="textRef" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "@vue/runtime-core";
import {
  onESCreate,
  onESDestroy,
  onESStart,
  onESNewIntent,
  onESRestart,
  onESRestoreInstanceState,
  onESResume,
  onESPause,
  onESStop,
  onESSaveInstanceState,
} from "@extscreen/es3-vue";

export default defineComponent({
  name: "hooks",
  setup() {
    const textRef = ref("");

    onESCreate(async (params) => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESCreate";
    });

    onESStart(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESStart";
    });

    onESNewIntent(async (intent) => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESNewIntent";
    });

    onESRestart(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESRestart";
    });

    onESRestoreInstanceState(async (savedInstanceState) => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESRestoreInstanceState";
    });

    onESResume(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESResume";
    });

    onESPause(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESPause";
    });

    onESStop(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESStop";
    });

    onESSaveInstanceState(async (savedInstanceState) => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESSaveInstanceState";
    });

    onESDestroy(async () => {
      const text = await initText();
      textRef.value = textRef.value + text + "onESDestroy";
    });

    function initText() {
      return Promise.resolve(" --> ");
    }

    return {
      textRef,
    };
  },
});
</script>

<style></style>
