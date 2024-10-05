module.exports = {
  apps: [
    {
      name: "gmgn-crawler",
      script: "npm",
      args: "run start:dev",
      cron_restart: "*/25 * * * *",
      autorestart: false,
      restart_delay: 6000,
      exp_backoff_restart_delay: 100,
      max_restarts: 0,
    },
    // {
    //   name: "1step-crawler",
    //   script: "npm",
    //   args: "run start:1step",
    //   cron_restart: "*/15 * * * *",
    //   autorestart: true,
    //   restart_delay: 600000,
    //   max_restarts: 5,
    //   exec_mode: "fork",
    //   wait_ready: true,
    //   listen_timeout: 120000, // 3分钟 = 3 * 60 * 1000 毫秒
    // },
  ],
};
