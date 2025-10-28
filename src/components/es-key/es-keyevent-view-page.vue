<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <es-key-event-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import es_key_event_view from "./es-keyevent-view.vue";

const TAG = "ESKeyEvent";

export default defineComponent({
  name: "按键（组件中监听）",
  emits: [],
  components: {
    "es-key-event-view": es_key_event_view,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
