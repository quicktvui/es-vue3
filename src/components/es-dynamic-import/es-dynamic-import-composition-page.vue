<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-button text="我是动态引入的 Composition API 页面"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";

const TAG = 'DynamicImport'

export default defineComponent({
  name: '我是动态引入的CompositionAPI页面',
  setup() {

    function onESCreate(params) {
      console.log('=======onESCreate=======>>>>>', params)
    }

    return {
      onESCreate
    }
  },
});

</script>

<style>
</style>
