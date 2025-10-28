<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <es-slot-view class="es-slot-view-css">
        <template #header>
          <div class="es-slot-header-view-css">
            <!--            <p>header 内容</p>-->
          </div>
        </template>

        <template #footer="{ text }">
          <p>footer 内容: {{ text }}</p>
        </template>
      </es-slot-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EsSlotView from "./ESSlotViewComponent";

export default defineComponent({
  name: "Slot",
  components: { EsSlotView },
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style>
.es-slot-view-css {
  width: 960px;
  height: 540px;
  background-color: #f20c00;
  align-items: center;
  justify-content: center;
}
.es-slot-header-view-css {
  width: 10px;
  height: 10px;
  background-color: green;
}
</style>
