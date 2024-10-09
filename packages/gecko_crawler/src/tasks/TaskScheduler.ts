import { CronJob } from 'cron';
import Bottleneck from 'bottleneck';

type TaskFunction = () => Promise<void>;

interface Task {
  name: string;
  schedule: string; // Cron 表达式
  taskFunction: TaskFunction;
}

class TaskScheduler {
  private tasks: Task[] = [];
  private limiter: Bottleneck;

  constructor(concurrency: number, minTime: number) {
    this.limiter = new Bottleneck({
      maxConcurrent: concurrency,
      minTime: minTime,
    });
  }

  registerTask(task: Task) {
    this.tasks.push(task);
  }

  start() {
    for (const task of this.tasks) {
      const cronJob = new CronJob(task.schedule, () => {
        // 使用限速器调度任务
        this.limiter
          .schedule(() => task.taskFunction())
          .then(() => {
            console.log(`任务 "${task.name}" 执行成功。`);
          })
          .catch((error) => {
            console.error(`任务 "${task.name}" 执行失败:`, error);
          });
      });
      cronJob.start();
      console.log(
        `任务 "${task.name}" 已按照 Cron 表达式 "${task.schedule}" 调度。`,
      );
    }
  }
}

export { TaskScheduler, Task };
