<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="Name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in pageList"
          :key="item.id"
          :text="item.name"
          :url="`css/${item.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import ESCSSNamePageList from "./index";

export default defineComponent({
  setup() {
    const pageList = Object.keys(ESCSSNamePageList).map((data) => ({
      id: data,
      name: ESCSSNamePageList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
