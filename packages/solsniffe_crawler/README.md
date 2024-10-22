## 项目结构
- src
  - main.ts
  - updateSolSecurity.ts

## 项目说明
- main.ts: 主函数，负责启动爬虫
- updateSolSecurity.ts: 更新Solana安全数据

## 使用方法
- 在项目根目录下运行 `yarn start:solsniffe_crawler` 启动爬虫
- 当前项目主要负责从 solsniffer 获取 solana 代币的安全数据，并更新到数据库中[solsniffer api](https://solsniffer.com/api/v1/sniffer/token/gVjogZYnqBd8jxqhKdV64TcAoiFDcjH1iYZCPfCpump)