#!/bin/bash

# 加载 .env 文件
set -a
source ../.env
set +a

while true
do
    echo "[$(date)] 启动 @dex_crawler/gmgn_crawler dev..."
    yarn start:gmgn_crawler
    echo "[$(date)] 执行完成，等待 10 分钟..."
    sleep 10 # 600 秒 = 10 分钟
done