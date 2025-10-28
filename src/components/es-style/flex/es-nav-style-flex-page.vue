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
          :url="`style/${item.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import ESStyleFlexPageList from "./index";

export default defineComponent({
  name: "flex",
  setup() {
    const pageList = Object.keys(ESStyleFlexPageList).map((data) => ({
      id: data,
      name: ESStyleFlexPageList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
