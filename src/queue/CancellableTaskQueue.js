import PriorityTaskQueue from './PriorityTaskQueue'

class CancellableTaskQueue extends PriorityTaskQueue {
  cancel(task) {
    const index = this.queue.findIndex(item => item.task === task);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log("任务已取消");
    }
  }
}

// 示例：取消未执行的任务
// const cancellableQueue = new CancellableTaskQueue(2);
//
// const taskToCancel = createTask("任务 C", 500);
// cancellableQueue.add(taskToCancel, 1);
// cancellableQueue.add(createTask("任务 D", 300), 2);
//
// cancellableQueue.cancel(taskToCancel); // 取消任务 C
