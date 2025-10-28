<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <s-text-button text="开始" @onButtonClicked="onStartButtonClicked"/>
      <s-text-button text="停止" @onButtonClicked="onStopButtonClicked"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import PriorityTaskQueue from '../../../src/queue/PriorityTaskQueue'

export default defineComponent({
  name: "JsQueue",
  setup() {

    function onStartButtonClicked() {

      const queue = new PriorityTaskQueue(1); // 设置并发数为 2

      const createTask = (name, time) => async () => {
        console.log(`${name} 开始`);
        await new Promise(resolve => setTimeout(resolve, time));
        console.log(`${name} 结束`);
      };

      // 添加任务并设置优先级
      queue.add(createTask("任务 1", 1000), 2); // 优先级 2
      queue.add(createTask("任务 2", 2500), 1);  // 优先级 1
      queue.add(createTask("任务 3", 700), 3);  // 优先级 3
      queue.add(createTask("任务 4", 300), 1);  // 优先级 1
      // 延迟添加任务
      setTimeout(() => {
        queue.add(createTask("任务 5", 300), 0); // 动态添加优先级更高的任务
      }, 100);

      // ConsoleModule.js:130 任务 1 开始
      // ConsoleModule.js:130 任务 2 开始
      // ConsoleModule.js:130 任务 2 结束
      // ConsoleModule.js:130 任务 4 开始
      // ConsoleModule.js:130 任务 4 结束
      // ConsoleModule.js:130 任务 3 开始
      // ConsoleModule.js:130 任务 1 结束
      // ConsoleModule.js:130 任务 3 结束
    }

    function onStopButtonClicked() {

    }

    const onESCreate = (params) => {

    }

    return {
      onESCreate,
      onStartButtonClicked,
      onStopButtonClicked,
    }
  },
});

</script>
<style>
</style>
