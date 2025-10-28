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

    onESCreate((params) => {
      textRef.value = textRef.value + " --> " + "onESCreate";
    });

    onESStart(() => {
      textRef.value = textRef.value + " --> " + "onESStart";
    });

    onESNewIntent((intent) => {
      textRef.value = textRef.value + " --> " + "onESNewIntent";
    });

    onESRestart(() => {
      textRef.value = textRef.value + " --> " + "onESRestart";
    });

    onESRestoreInstanceState((savedInstanceState) => {
      textRef.value = textRef.value + " --> " + "onESRestoreInstanceState";
    });

    onESResume(() => {
      textRef.value = textRef.value + " --> " + "onESResume";
    });

    onESPause(() => {
      textRef.value = textRef.value + " --> " + "onESPause";
    });

    onESStop(() => {
      textRef.value = textRef.value + " --> " + "onESStop";
    });

    onESSaveInstanceState((savedInstanceState) => {
      textRef.value = textRef.value + " --> " + "onESSaveInstanceState";
    });

    onESDestroy(() => {
      textRef.value = textRef.value + " --> " + "onESDestroy";
    });

    return {
      textRef,
    };
  },
});
</script>

<style></style>
