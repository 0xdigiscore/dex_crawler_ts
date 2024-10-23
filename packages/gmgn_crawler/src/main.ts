import { router } from '@/routes.js';
import { crawlerGmgnUrlConfigs } from './const/crawlerUrls.js';
import gmgn from './site/gmgn.js';
import { RequestQueue } from 'crawlee';

async function main() {
  const requestQueue = await RequestQueue.open();
  requestQueue.addRequests(crawlerGmgnUrlConfigs);

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
    console.log('爬虫资源已清理，程序正常退出');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('程序执行过程中发生未捕获的错误:', error);
  process.exit(1);
});
