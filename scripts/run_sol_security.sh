#!/bin/bash

# 加载 .env 文件
set -a
source ../.env
set +a

while true
do
    echo "[$(date)] 启动 @dex_crawler/solsniffe_crawler start:token_stats..."
    yarn start:solsniffe_crawler
    echo "[$(date)] 执行完成，等待 2 分钟..."
    sleep 30
done