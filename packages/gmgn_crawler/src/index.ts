import express from 'express';
import bodyParser from 'body-parser';
import { router } from '@/routes.js';
import gmgn from './site/gmgn.js';
import { RequestQueue } from 'crawlee';
import { generateTopBuyersUrl } from './utils/urlGenerate.js';
import prisma from './database/prisma.js';

const app = express();
const PORT = 3000;

// 使用 body-parser 来解析 JSON 格式的请求体
app.use(bodyParser.json());

// 创建一个 POST 请求的 webhook 路由
app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('Received webhook data:', data);
  const list = [
    {
      chain: data.chain,
      token: data.token,
    },
  ];
  const requestQueue = await RequestQueue.open();
  const urls = [];
  for (let item of list) {
    urls.push({
      url: generateTopBuyersUrl(item.token, item.chain),
      label: 'top/buyers',
      datasetName: 'top_buyers',
    });
  }
  await requestQueue.addRequests(urls);

  const crawler = gmgn({
    requestHandler: router,
    requestQueue,
  });

  try {
    await crawler.run();
    console.log('爬虫任务成功完成');
    res.sendStatus(200); // 返回成功状态码
  } catch (error) {
    console.error('爬虫运行过程中发生错误:', error);
    res.sendStatus(500); // 返回成功状态码
  } finally {
    await crawler.teardown();
    console.log('爬虫资源已清理，程序正常退出');
  }
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// 监听进程的关闭事件
async function handleExit(signal: string) {
  server.close(async () => {
    console.log('Server closed.');
    await prisma.$disconnect();
  });
}

// 捕捉系统信号，用于优雅地关闭连接
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('SIGQUIT', handleExit);
process.on('exit', (code) => {
  console.log(`Process exit event with code: ${code}`);
});
