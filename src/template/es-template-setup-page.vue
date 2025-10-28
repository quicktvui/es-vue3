<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-view text="Text"></s-text-view>
      <s-text-button text="按钮" @onButtonClicked="onButtonClicked"/>
    </div>
  </div>
</template>

<script setup="props, context" lang="ts">
import {useESToast} from "@extscreen/es3-core";

const toast = useESToast()
//---------------------------------------------------------
import {defineProps} from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

//---------------------------------------------------------
import {defineEmits} from 'vue'

const emit = defineEmits(['change', 'delete'])
const handleClick = () => {
  emit('change', 5);
}
const onButtonClicked = () => {
  emit('delete', 8);
  toast.showToast("点击了按钮")
}

</script>

<style>
</style>
