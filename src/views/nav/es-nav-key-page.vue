<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css" @keydown="keydown" @keyup="keyup">
      <div class="es-sdk-content-row-css">
        <s-nav-button
          v-for="(item, _) in pageList"
          :key="item.id"
          :text="item.name"
          :url="`key/${item.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ESKeyPageList from "../../components/es-key";
import { ESKeyEvent, ESLogLevel, useESLog } from "@extscreen/es3-core";

const TAG = "ESKeyEventNavPage";

export default defineComponent({
  name: "按键",
  emits: [],
  setup() {
    const log = useESLog();

    const pageList = Object.keys(ESKeyPageList).map((data) => ({
      id: data,
      name: ESKeyPageList[data].name,
    }));
    function keydown(keyEvent: ESKeyEvent) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------keydown------->>>", keyEvent);
      }
    }

    function keyup(keyEvent: ESKeyEvent) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "---------------keyup------->>>", keyEvent);
      }
    }
    return {
      pageList,
      keydown,
      keyup,
    };
  },
});
</script>
<style></style>
