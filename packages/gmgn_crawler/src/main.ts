import { router } from '@/routes.js';
import { crawlerGmgnUrlConfigs } from './const/crawlerUrls.js';
import gmgn from './site/gmgn.js';
import { RequestQueue } from 'crawlee';
import { generateTopBuyersUrl } from './utils/urlGenerate.js';
import prisma from './database/prisma.js';

const data = [
  {
    chain: 'sol',
    token: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
  },
  // {
  //   chain: 'sol',
  //   token: 'FqvtZ2UFR9we82Ni4LeacC1zyTiQ77usDo31DUokpump',
  // },
  // {
  //   chain: 'sol',
  //   token: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
  // },
];

async function main() {
  const requestQueue = await RequestQueue.open();
  const urls = [];
  for (let item of data) {
    urls.push({
      url: generateTopBuyersUrl(item.token, item.chain),
      label: 'top/buyers',
      datasetName: 'top_buyers',
    });
  }
  requestQueue.addRequests([...urls, ...crawlerGmgnUrlConfigs]);

  const crawler = gmgn({
    requestHandler: router,
    requestQueue,
  });

  try {
    await crawler.run();
    console.log('爬虫任务成功完成');
  } catch (error) {
    console.error('爬虫运行过程中发生错误:', error);
  } finally {
    await crawler.teardown();
    await prisma.$disconnect();
    console.log('爬虫资源已清理，程序正常退出');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('程序执行过程中发生未捕获的错误:', error);
  process.exit(1);
});
