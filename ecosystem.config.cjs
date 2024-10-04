module.exports = {
  apps: [
    {
      name: "gmgn-crawler",
      script: "npm",
      args: "run start:gmgn",
      cron_restart: "*/10 * * * *",
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 5,
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
