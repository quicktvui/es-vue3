<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="主题" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <s-text-view text="main.ts 中设置主题变量，并选择主题。"></s-text-view>
      <s-text-view :text="text"></s-text-view>
      <div class="es-sdk-content-row-css">
        <s-text-button text="浅色模式" @onButtonClicked="onLightButtonClicked" />
        <s-text-button text="深色模式" @onButtonClicked="onDarkButtonClicked" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESTheme } from "@extscreen/es3-core";
import { ref } from "vue";

export default defineComponent({
  emits: [],
  setup() {
    const theme = useESTheme();
    const text = ref<string>(`
      const themeManager = app.theme;
      themeManager.registerTheme('light', {
      "--primary-color": "#9890ff",
      "--text-color": "#000000",
      "--bg-color": "#ffffff",
      "--divider-color": "#40b883",
      });

      themeManager.registerTheme('dark', {
      "--primary-color": "#ff4d4f",
      "--text-color": "red",
      "--bg-color": "#1f1f1f",
      "--divider-color": "#91b200",
      });

      themeManager.setTheme("light");
      `);

    function onLightButtonClicked() {
      theme.setTheme("light");
    }

    function onDarkButtonClicked() {
      theme.setTheme("dark");
    }

    return {
      text,
      onLightButtonClicked,
      onDarkButtonClicked,
    };
  },
});
</script>

<style></style>
