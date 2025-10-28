<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-view :text="text"></s-text-view>
      <s-text-button :text="buttonText" @onButtonClicked="onButtonClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  name: "起步",
  emits: [],
  setup() {
    const buttonText = ref<string>("点击按钮");
    const text = ref<string>("Text");

    function onButtonClicked() {
      buttonText.value = new Date().getTime().toString();
      text.value = new Date().getTime().toString();
    }

    return {
      onButtonClicked,
      buttonText,
      text,
    };
  },
});
</script>

<style scoped></style>
