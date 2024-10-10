import { TaskScheduler, Task } from './tasks/TaskScheduler.js';
import updateTokenMetrics from './tasks/updateTokenMetrics.js';
import updateTokenSecurity from './tasks/UpdateTokenSecurity.js';
import updateTokenStats from './tasks/UpdateTokenStats.js';

// 定义任务
const updateTokenMetricsTask: Task = {
  name: '更新 Token 指标',
  schedule: '* * * * *', // 每分钟执行一次
  taskFunction: updateTokenMetrics,
};

const updateTokenSecurityTask: Task = {
  name: '更新 Token 安全',
  schedule: '*/2 * * * *', // 每2分钟执行一次
  taskFunction: updateTokenSecurity,
};

const updateTokenStatsTask: Task = {
  name: '更新 Token 统计',
  schedule: '*/2 * * * *', // 每1分钟执行一次
  taskFunction: updateTokenStats,
};

// 初始化任务调度器
const taskScheduler = new TaskScheduler(3, 100); // 可根据需要调整并发和最小时间间隔

// 注册任务
taskScheduler.registerTask(updateTokenMetricsTask);
taskScheduler.registerTask(updateTokenSecurityTask);
//taskScheduler.registerTask(updateTokenStatsTask);

// 启动调度器
taskScheduler.start();
updateTokenSecurity();
//updateTokenStats();
