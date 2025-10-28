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
import PriorityTaskQueue from '../../../src/worker/PriorityTaskQueue.ts'
import Worker from './worker'

export default defineComponent({
  name: "使用初探",
  setup() {

    function onStartButtonClicked() {

      // postMessage('线程完成')

      const queue = new PriorityTaskQueue(2); // 设置并发数为 2

      // 创建异步任务
      const createTask = (name: string, time: number): Task => async () => {
        console.log(`${name} 开始`);
        await new Promise(resolve => setTimeout(resolve, time));
        console.log(`${name} 结束`);
      };

      // 添加任务并设置优先级
      queue.add(createTask("任务 1", 1000), 2); // 优先级 2
      queue.add(createTask("任务 2", 500), 1);  // 优先级 1
      queue.add(createTask("任务 3", 700), 3);  // 优先级 3
      queue.add(createTask("任务 4", 300), 1);  // 优先级 1


      // const worker = new Worker()
      // worker.postMessage('开启线程')
      // worker.onmessage = (e: { data: string; }) => {
      //   console.log(e.data)
      //   setTimeout(() => {
      //     worker.postMessage('线程关闭')
      //     worker.terminate()
      //   }, 1000)
      // }
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
