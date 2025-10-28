<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="rem" />
    <div class="es-sdk-content-divider-css" />
    <div :clipChildren="false">
      <div class="css-rem-css" :focusable="true" :enableFocusBorder="false" :focusScale="1.1">
        <s-text-view :text="textRef" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  emits: [],
  setup() {
    const textRef = ref<string>(
      "main.ts中设置基准 remBase\n" +
        "----------------------------------------------\n" +
        "createESApp(application, router, {\n" +
        "  debug: true,\n" +
        "  styleOptions: {\n" +
        "    remBase: 16;//默认16\n" +
        "  },\n" +
        "});" +
        "",
    );
    return {
      textRef,
    };
  },
});
</script>

<style scoped>
.css-rem-css {
  width: 60rem;
  height: 33.75rem;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
