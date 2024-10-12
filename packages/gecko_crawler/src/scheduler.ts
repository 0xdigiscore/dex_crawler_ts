import { TaskScheduler, Task } from './tasks/TaskScheduler.js';
import updateTokenMetrics from './tasks/updateTokenMetrics.js';

// 定义任务
const updateTokenMetricsTask: Task = {
  name: '更新 Token 指标',
  schedule: '*/2 * * * *', // 每2分钟执行一次
  taskFunction: updateTokenMetrics,
};

// 初始化任务调度器
const taskScheduler = new TaskScheduler(2, 100); // 可根据需要调整并发和最小时间间隔

// 注册任务
taskScheduler.registerTask(updateTokenMetricsTask);

// 启动调度器
taskScheduler.start();
