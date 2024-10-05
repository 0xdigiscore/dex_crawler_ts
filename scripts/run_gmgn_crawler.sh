#!/bin/bash

while true
do
    echo "[$(date)] 启动 @dex_crawler/gmgn_crawler dev..."
    yarn workspace @dex_crawler/gmgn_crawler dev
    echo "[$(date)] 执行完成，等待 10 分钟..."
    sleep 600 # 600 秒 = 10 分钟
done