// type Task = () => Promise<void>; // 定义任务的类型
//
// interface QueueItem {
//   task: Task;
//   priority: number;
// }
//
// class PriorityTaskQueue {
//
//   private queue: QueueItem[] = []; // 存储任务队列
//   private running = 0; // 当前运行中的任务数
//   private concurrency: number; // 最大并发数
//
//   constructor(concurrency: number = 1) {
//     this.concurrency = concurrency;
//   }
//
//   /**
//    * 添加任务到队列
//    * @param task - 任务函数，需返回 Promise
//    * @param priority - 任务优先级，数值越小优先级越高
//    */
//   public add(task: Task, priority: number = 0): void {
//     this.queue.push({ task, priority });
//     // 按优先级排序（数值越小，优先级越高）
//     this.queue.sort((a, b) => a.priority - b.priority);
//     this.run(); // 尝试运行任务
//   }
//
//   /**
//    * 执行任务队列
//    */
//   private async run(): Promise<void> {
//     // 如果达到并发限制或队列为空，直接返回
//     if (this.running >= this.concurrency || this.queue.length === 0) {
//       return;
//     }
//
//     const { task } = this.queue.shift()!; // 获取优先级最高的任务
//     this.running++; // 增加运行任务计数
//
//     try {
//       await task(); // 执行任务
//     } catch (error) {
//       console.error("任务执行失败:", error);
//     } finally {
//       this.running--; // 减少运行任务计数
//       this.run(); // 尝试执行下一个任务
//     }
//   }
//
//   /**
//    * 动态调整并发数
//    * @param concurrency - 新的并发数
//    */
//   public setConcurrency(concurrency: number): void {
//     this.concurrency = concurrency;
//     this.run(); // 尝试运行队列中的任务
//   }
//
//   /**
//    * 取消指定任务
//    * @param task - 要取消的任务
//    */
//   public cancel(task: Task): void {
//     const index = this.queue.findIndex(item => item.task === task);
//     if (index !== -1) {
//       this.queue.splice(index, 1);
//       console.log("任务已取消");
//     }
//   }
// }
