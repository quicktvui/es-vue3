<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in pageList"
          :key="item.id"
          :text="item.name"
          :url="`httpserver/${item.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import ESAndroidHttpServerList from "../../components/es-local-http-server";

export default defineComponent({
  name: "本地服务",
  setup() {
    const pageList = Object.keys(ESAndroidHttpServerList).map((data) => ({
      id: data,
      name: ESAndroidHttpServerList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
