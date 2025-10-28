<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <s-text-view :text="textRef" />
      <div class="es-sdk-content-row-css">
        <s-text-button text="Get请求网络" @onButtonClicked="onButtonClicked" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import axios, { isCancel, AxiosError } from "@extscreen/es3-axios";

const TAG = "ESAxios";

export default defineComponent({
  name: "get",
  emits: [],
  setup() {
    const textRef = ref("");

    function onButtonClicked() {
      axios({
        method: "get",
        url: "https://quicktvui.com",
      })
        .then(function (response) {
          textRef.value = JSON.stringify(response);
          console.log("----axios------response------------->>>>>", response);
        })
        .catch(function (error) {
          textRef.value = JSON.stringify(error);
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
          console.log("----axios------finally------------->>>>>");
        });
    }

    return {
      textRef,
      onButtonClicked,
    };
  },
});
</script>

<style></style>
