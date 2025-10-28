<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button
        text="创建节点"
        :requestFocus="true"
        @onButtonClicked="onCreateButtonClicked"
      />
      <s-text-button text="删除节点" @onButtonClicked="onDeleteButtonClicked" />
      <div class="es-sdk-content-row-css es-performance-node-root-css">
        <div v-for="(item, index) in nodeList" class="es-performance-node-css" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import { useESLog, useESToast } from "@extscreen/es3-core";
import { onESCreate } from "@extscreen/es3-vue";

const TAG = "Performance";

export default defineComponent({
  name: "创建节点",
  emits: [],
  setup() {
    const log = useESLog();
    const toast = useESToast();

    const nodeList = ref<Array>([]);

    const nodes = [];
    for (let i = 0; i < 10000; i++) {
      nodes.push({ index: i });
    }

    function onCreateButtonClicked() {
      toast.showToast("开始");
      console.log("----Performance---性能排查----点击创建节点按钮---->>>>>", new Date().getTime());
      nodeList.value = nodes;
    }

    function onDeleteButtonClicked() {
      console.log("----Performance---性能排查----点击创建节点按钮---->>>>>", new Date().getTime());
      nodeList.value = [];
    }

    return {
      onCreateButtonClicked,
      onDeleteButtonClicked,
      nodeList,
    };
  },
});
</script>

<style scoped>
.es-performance-node-root-css {
  background-color: palevioletred;
  width: 1920px;
  height: 800px;
}

.es-performance-node-css {
  width: 10px;
  height: 10px;
  margin: 10px;
  background-color: #40b883;
}
</style>
