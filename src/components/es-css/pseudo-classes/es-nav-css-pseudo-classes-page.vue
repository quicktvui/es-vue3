<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="PseudoClasses" />
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
import ESCSSPseudoClassesPageList from "./index";

export default defineComponent({
  setup() {
    const pageList = Object.keys(ESCSSPseudoClassesPageList).map((data) => ({
      id: data,
      name: ESCSSPseudoClassesPageList[data].name,
    }));

    return {
      pageList,
    };
  },
});
</script>
<style></style>
