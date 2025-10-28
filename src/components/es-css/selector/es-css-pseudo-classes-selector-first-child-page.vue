<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text=":first-child" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css" :clipChildren="false">
      <div class="list">
        <div
          :clipChildren="false"
          :focusable="true"
          :enableFocusBorder="true"
          :focusScale="1.1"
          class="item"
        >
          <p>首页</p>
        </div>
        <div
          :clipChildren="false"
          :focusable="true"
          :enableFocusBorder="true"
          :focusScale="1.1"
          class="item"
        >
          <p>关于我们</p>
        </div>
        <div
          :clipChildren="false"
          :focusable="true"
          :enableFocusBorder="true"
          :focusScale="1.1"
          class="item"
        >
          <p>服务</p>
        </div>
        <div
          :clipChildren="false"
          :focusable="true"
          :enableFocusBorder="true"
          :focusScale="1.1"
          class="item"
        >
          <p>联系</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  emits: [],
  setup() {
    return {};
  },
});
</script>

<style scoped>
.list {
  width: 500px;
  height: 500px;
  background-color: #40b883;
  align-items: center;
  justify-content: center;
}

.item {
  width: 400px;
  height: 100px;
  background-color: purple;
  margin-bottom: 5px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.list div:first-child {
  font-weight: bold;
  color: red;
  background-color: darkturquoise;
}
</style>
