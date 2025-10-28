// class CallbackTaskQueue extends PriorityTaskQueue {
//   private callback?: () => void;
//
//   constructor(concurrency: number = 1, callback?: () => void) {
//     super(concurrency);
//     this.callback = callback;
//   }
//
//   // 重写 run 方法添加回调
//   protected async run(): Promise<void> {
//     if (this.running >= this.concurrency || this.queue.length === 0) {
//       return;
//     }
//
//     const { task } = this.queue.shift()!;
//     this.running++;
//
//     try {
//       await task();
//     } catch (error) {
//       console.error("任务执行失败:", error);
//     } finally {
//       this.running--;
//       if (this.callback) this.callback();
//       this.run();
//     }
//   }
// }
//
// // 使用示例
// // const callbackQueue = new CallbackTaskQueue(2, () => console.log("任务完成回调！"));
// // callbackQueue.add(createTask("任务 A", 800), 2);
// // callbackQueue.add(createTask("任务 B", 400), 1);
