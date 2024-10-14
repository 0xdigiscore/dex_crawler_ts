import { TaskScheduler, Task } from './tasks/TaskScheduler.js';
import updateTokenSecurity from './tasks/updateGoplusTokenSecurity.js';

// 定义任务
const updateTokenSecurityTask: Task = {
  name: '更新 Token 指标',
  schedule: '*/1 * * * *', // 每2分钟执行一次
  taskFunction: updateTokenSecurity,
};

// 初始化任务调度器
const taskScheduler = new TaskScheduler(2, 100); // 可根据需要调整并发和最小时间间隔

// 注册任务
taskScheduler.registerTask(updateTokenSecurityTask);

// 启动调度器
taskScheduler.start();
