import cron from "node-cron";

export interface CrawlerTask {
  name: string;
  execute: () => Promise<void>;
  schedule: string;
}

export class Scheduler {
  private tasks: CrawlerTask[] = [];
  private cronJobs: cron.ScheduledTask[] = [];

  addTask(task: CrawlerTask) {
    this.tasks.push(task);
  }

  start() {
    this.tasks.forEach((task) => {
      const job = cron.schedule(task.schedule, () => {
        console.log(`Running task: ${task.name}`);
        this.runTask(task);
      });
      this.cronJobs.push(job);
    });
  }

  private async runTask(task: CrawlerTask) {
    try {
      await task.execute();
      console.log(`Task ${task.name} completed successfully`);
      // 任务完成后退出进程
      process.exit(0);
    } catch (error) {
      console.error(`Error in task ${task.name}: ${error}`);
      // 发生错误时也退出进程，但使用非零退出码
      process.exit(1);
    }
  }

  stop() {
    this.cronJobs.forEach((job) => job.stop());
  }
}
