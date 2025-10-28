/**
 * 优先级队列
 */
class PriorityTaskQueue {

  constructor(concurrency = 1, callback = null) {
    this.queue = []; // 存储任务队列
    this.concurrency = concurrency; // 最大并发数
    this.running = 0; // 当前运行中的任务数
    this.callback = callback; // 任务完成时的回调
  }

  /**
   * 添加任务到队列
   * @param {Function} task - 任务函数，需返回 Promise
   * @param {number} priority - 任务优先级，数值越小优先级越高
   */
  add(task, priority = 0) {
    this.queue.push({ task, priority });
    // 按优先级对队列重新排序
    this.queue.sort((a, b) => a.priority - b.priority);
    this.run(); // 尝试运行任务
  }

  /**
   * 取消任务
   * @param task
   */
  cancel(task) {
    const index = this.queue.findIndex(item => item.task === task);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log("任务已取消");
    }
  }

  /**
   * 执行任务队列
   */
  async run() {
    // 如果达到并发限制或队列为空，直接返回
    if (this.running >= this.concurrency || this.queue.length === 0) return;

    const { task } = this.queue.shift(); // 获取队列中优先级最高的任务
    this.running++; // 增加运行任务计数

    try {
      await task(); // 执行任务
    } catch (error) {
      console.error("任务执行失败:", error);
    } finally {
      this.running--; // 减少运行任务计数
      if (this.callback) this.callback(); // 执行回调
      this.run(); // 尝试执行下一个任务
    }
  }
}

export default PriorityTaskQueue
