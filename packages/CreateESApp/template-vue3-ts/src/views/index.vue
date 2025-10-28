<template>
  <div class="index-root-view-css">
    <span class="index-root-text-view-css">Hello World!</span>
  </div>
</template>

<script lang="ts">

import {defineComponent,} from '@vue/runtime-core';

export default defineComponent({
  name: 'index',
  setup() {
    return {};
  },
});
</script>

<style>
.index-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: darkgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.index-root-text-view-css {
  font-size: 50px;
  color: black;
}
</style>

