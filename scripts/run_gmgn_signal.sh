#!/bin/bash

# 加载 .env 文件
set -a
source ../.env
set +a

while true
do
    echo "[$(date)] 启动 @dex_crawler/gmgn_signal dev..."
    yarn workspace @dex_crawler/gmgn_signal dev
    echo "[$(date)] 执行完成，等待 2 分钟..."
    sleep 60
done