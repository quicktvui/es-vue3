<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="我是动态引入的 setup 页面"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-button text="我是动态引入的 setup 页面"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

const TAG = 'DynamicImport'

function onESCreate(params) {
  console.log('=======onESCreate=======>>>>>', params)
}

defineExpose({
  onESCreate,

})


</script>

<style>
</style>
