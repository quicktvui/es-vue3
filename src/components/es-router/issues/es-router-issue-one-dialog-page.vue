<template>
  <div class="es-sdk-dialog-root-css">
    <s-title-view class="es-sdk-content-title-css" text="场景一：弹窗" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="点击push页面" @onButtonClicked="pushPage" />
      <s-text-button text="点击replace页面" @onButtonClicked="replacePage" />
      <s-text-button text="点击push弹窗" @onButtonClicked="pushDialog" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import { useESRouter } from "@extscreen/es3-router";

export default defineComponent({
  setup() {
    const router = useESRouter();

    function pushPage() {
      router.push("es_router_issue_one_page");
    }

    function replacePage() {
      router.replace("es_router_issue_one_page");
    }

    function pushDialog() {
      router.push("es_router_issue_one_dialog_page");
    }

    return {
      pushPage,
      pushDialog,
      replacePage,
    };
  },
});
</script>

<style></style>
