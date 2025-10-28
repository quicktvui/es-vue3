<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-column-css">
      <s-text-view :text="textRef"/>
      <div class="es-sdk-content-row-css">
        <s-text-button text="请求网络" @onButtonClicked="onButtonClicked"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, ref} from "@vue/runtime-core";
import axios, {isCancel, AxiosError} from '@extscreen/es3-axios';

const TAG = 'ESAxios'

export default defineComponent({
  name: 'Interceptors',
  setup() {
    const textRef = ref("")

    function onButtonClicked() {

      axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log('----axios------interceptors------request------->>>>>', config);
        return config;
      }, function (error) {
        console.log('----axios------interceptors------request----error--->>>>>', error);
        // Do something with request error
        return Promise.reject(error);
      });

      // Add a response interceptor
      axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        console.log('----axios------interceptors------response------->>>>>', response);
        return response;
      }, function (error) {
        console.log('----axios------interceptors------response----error--->>>>>', error);
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      });

      // // Make a request for a user with a given ID
      axios.get('https://quicktvui.com')
        .then(function (response) {
          console.log('----axios------response------DEMO------->>>>>', response);
          // handle success
          textRef.value = JSON.stringify(response)
          console.log(response);
        })
        .catch(function (error) {
          console.log('----axios------error------DEMO------->>>>>', error);
          // handle error
          textRef.value = JSON.stringify(error)
          console.log(error);
        })
        .finally(function () {
          // always executed
          console.log('----axios------finally------DEMO------->>>>>');
        });
    }

    return {
      textRef,
      onButtonClicked,
    }
  },
});

</script>

<style>
</style>
