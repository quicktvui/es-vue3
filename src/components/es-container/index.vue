<template>
  <div :clipChildren="false" :focusable="false">
    <slot />
  </div>
</template>

<script>
export default {
  name: "es-container",
};
</script>

<script setup></script>

<style scoped></style>
