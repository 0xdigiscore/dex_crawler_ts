#!/bin/bash

# 加载 .env 文件
set -a
source ../.env
set +a

while true
do
    echo "[$(date)] 启动 @dex_crawler/gecko_crawler start:security..."
    yarn start:token_security_crawler
    echo "[$(date)] 执行完成，等待 2 分钟..."
    sleep 60
done