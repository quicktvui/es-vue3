<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-column-css">
      <s-text-view :text="textRef" />
      <div class="es-sdk-content-row-css">
        <s-text-button text="Post请求网络" @onButtonClicked="onButtonClicked" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import axios, { isCancel, AxiosError } from "@extscreen/es3-axios";

const TAG = "ESAxios";

export default defineComponent({
  name: "post",
  emits: [],
  setup() {
    const textRef = ref("");

    function onButtonClicked() {
      // axios({
      //   method: 'post',
      //   url: 'https://test.kkapp.com/kknewyixueserver/v1/goods/getProductList/lite',
      //   data: params,
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then((response) => {
      //   console.log('axios response', response);
      // })

      const params = {
        sn: "NXA2045WC014819LI3R1",
        goodsId: "175",
        qrcodeUrl: "http://test.kkapp.com/project/kknewyixueserver/tv-cashier/dist/#/H5?p=",
        payserver: 1,
        deviceID: "",
      };

      const fd = axios.toFormData(params);
      axios({
        method: "post",
        url: "https://test.kkapp.com/kknewyixueserver/v1/goods/getProductList/lite",
        // data: fd.getBody(),
        headers: {
          "Content-Type": fd.getContentType(),
        },
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
