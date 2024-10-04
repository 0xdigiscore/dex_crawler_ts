module.exports = {
  apps: [
    {
      name: "gmgn-crawler",
      script: "npm",
      args: "run start",
      cron_restart: "*/5 * * * *",
      autorestart: false,
    },
  ],
};
