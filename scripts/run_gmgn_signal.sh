#!/bin/bash

# 加载 .env 文件
set -a
source ../.env
set +a

while true
do
    echo "[$(date)] 启动 @dex_crawler/gmgn_signal dev..."
    yarn start:signal
    echo "[$(date)] 执行完成，即将开始下一轮"
    sleep 1
done