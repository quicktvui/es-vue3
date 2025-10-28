<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="场景一：页面" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="点击跳转页面" @onButtonClicked="launchPage" />
      <s-text-button text="点击跳转弹窗" @onButtonClicked="launchDialog" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import { useESRouter } from "@extscreen/es3-router";

export default defineComponent({
  setup() {
    const router = useESRouter();

    function launchPage() {
      router.push("es_router_issue_one_page");
    }

    function launchDialog() {
      router.push("es_router_issue_one_dialog_page");
    }

    return {
      launchPage,
      launchDialog,
    };
  },
});
</script>

<style></style>
