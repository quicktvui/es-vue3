<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css" ref="divRef">

    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {useESToast} from "@extscreen/es3-core";
import {Native} from "@extscreen/es3-vue";

export default defineComponent({
  name: "div",
  setup() {

    const divRef = ref()
    const toast = useESToast()

    const onESCreate = (params) => {
      setTimeout(() => {
        toast.showToast('￥######')
        // Native.callUIFunction(divRef.value, 'clearFocus', []);
        divRef.value?.clearFocus()
        // qt.ul.clearFocus(divRef)
      }, 1000)
    }

    return {
      divRef,
      onESCreate,
    }
  },
});

</script>
<style>
</style>
