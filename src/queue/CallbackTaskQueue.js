import PriorityTaskQueue from './PriorityTaskQueue'

class CallbackTaskQueue extends PriorityTaskQueue {

  constructor(concurrency = 1, callback = null) {
    super(concurrency);
    this.callback = callback; // 任务完成时的回调
  }

  async run() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;

    const { task } = this.queue.shift();
    this.running++;

    try {
      await task();
    } catch (error) {
      console.error("任务执行失败:", error);
    } finally {
      this.running--;
      if (this.callback) this.callback(); // 执行回调
      this.run();
    }
  }
}

// 示例：使用任务完成回调
// const callbackQueue = new CallbackTaskQueue(2, () => console.log("任务完成回调！"));
// callbackQueue.add(createTask("任务 A", 800), 2);
// callbackQueue.add(createTask("任务 B", 400), 1);
