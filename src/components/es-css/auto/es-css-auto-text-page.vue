<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="text-view（未实现）" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <text-view
        class="css-auto-text-css"
        text="消毒记录大姐夫双联单控飞机了受打击发啦受打击"
        :focusable="true"
        :enableFocusBorder="false"
        :focusScale="1.1"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style scoped>
.css-auto-text-css {
  width: 100px;
  height: 100px;
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
}
</style>
