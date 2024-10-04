module.exports = {
  apps: [
    {
      name: "gmgn-crawler",
      script: "npm",
      args: "run start:gmgn",
      cron_restart: "*/5 * * * *",
      autorestart: true,
      restart_delay: 3000, // 5分钟 = 5 * 60 * 1000 毫秒
      max_restarts: 5,
    },
    {
      name: "1step-crawler",
      script: "npm",
      args: "run start:1step",
      cron_restart: "*/15 * * * *",
      autorestart: true,
      restart_delay: 600000, // 10分钟 = 5 * 60 * 1000 毫秒
      max_restarts: 5,
    },
  ],
};
