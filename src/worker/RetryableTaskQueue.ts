// class RetryableTaskQueue extends PriorityTaskQueue {
//   private maxRetries: number;
//
//   constructor(concurrency: number = 1, maxRetries: number = 3) {
//     super(concurrency);
//     this.maxRetries = maxRetries;
//   }
//
//   public addWithRetry(task: Task, priority: number = 0, retries: number = this.maxRetries): void {
//     const retryableTask: Task = async () => {
//       try {
//         await task();
//       } catch (error) {
//         if (retries > 0) {
//           console.log("任务失败，重试中...");
//           this.addWithRetry(task, priority, retries - 1);
//         } else {
//           console.error("任务重试失败，放弃任务:", error);
//         }
//       }
//     };
//     this.add(retryableTask, priority);
//   }
// }
//
// // 示例：任务重试
// // const retryQueue = new RetryableTaskQueue(2);
// // retryQueue.addWithRetry(async () => {
// //   console.log("尝试执行任务");
// //   throw new Error("任务失败");
// // }, 1);
