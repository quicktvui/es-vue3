<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="退出应用" @onButtonClicked="exitApp" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESApp } from "@extscreen/es3-core";

export default defineComponent({
  name: "Application",
  emits: [],
  setup() {
    const app = useESApp();

    function exitApp() {
      console.log("------app---------->>>>>", app);
      console.log("------app-----exit----->>>>>", app.exit);
      app.exit();
    }

    const onESCreate = (params) => {};

    const onESDestroy = () => {};

    return {
      onESCreate,
      onESDestroy,
      exitApp,
    };
  },
});
</script>
<style></style>
