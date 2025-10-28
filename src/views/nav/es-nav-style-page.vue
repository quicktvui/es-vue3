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
import ESStylePageList from "../../components/es-style";

export default defineComponent({
  name: "样式",
  setup() {
    const pageList = Object.keys(ESStylePageList).map((data) => ({
      id: data,
      name: ESStylePageList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
