<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="Selector" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in basicSelectorPageList"
          :key="item.id"
          :text="item.name"
          :url="`css/${item.id}`"
        />
      </div>
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in combinatorsSelectorPageList"
          :key="item.id"
          :text="item.name"
          :url="`css/${item.id}`"
        />
      </div>
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in attributeSelectorPageList"
          :key="item.id"
          :text="item.name"
          :url="`css/${item.id}`"
        />
      </div>
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in pseudoClassesSelectorPageList"
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
import {
  ESCSSBasicSelectorPageList,
  ESCSSCombinatorsSelectorPageList,
  ESCSSAttributeSelectorPageList,
  ESCSSPseudoClassesSelectorPageList,
} from "./index";

export default defineComponent({
  setup() {
    const basicSelectorPageList = Object.keys(ESCSSBasicSelectorPageList).map((data) => ({
      id: data,
      name: ESCSSBasicSelectorPageList[data].name,
    }));
    const combinatorsSelectorPageList = Object.keys(ESCSSCombinatorsSelectorPageList).map(
      (data) => ({
        id: data,
        name: ESCSSCombinatorsSelectorPageList[data].name,
      }),
    );
    const attributeSelectorPageList = Object.keys(ESCSSAttributeSelectorPageList).map((data) => ({
      id: data,
      name: ESCSSAttributeSelectorPageList[data].name,
    }));
    const pseudoClassesSelectorPageList = Object.keys(ESCSSPseudoClassesSelectorPageList).map(
      (data) => ({
        id: data,
        name: ESCSSPseudoClassesSelectorPageList[data].name,
      }),
    );
    return {
      basicSelectorPageList,
      combinatorsSelectorPageList,
      attributeSelectorPageList,
      pseudoClassesSelectorPageList,
    };
  },
});
</script>
<style></style>
