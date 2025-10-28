<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="theme" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in pageList"
          :key="item.id"
          :text="item.name"
          :url="`theme/${item.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import ESThemePageList from "../../components/es-theme";

export default defineComponent({
  setup() {
    const pageList = Object.keys(ESThemePageList).map((data) => ({
      id: data,
      name: ESThemePageList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
