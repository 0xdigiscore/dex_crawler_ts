import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { router } from '@/routes.js';
import { firefox } from 'playwright';
import { crawlerGmgnUrlConfigs } from './const/crawlerUrls.js';

// const proxyConfiguration = new ProxyConfiguration({
//   proxyUrls: [process.env.PROXY_URL as string],
// });

async function main() {
  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    // Unified Cookies Management and Rate Limiting
    sessionPoolOptions: {
      maxPoolSize: 20,
    },
    launchContext: {
      // Set the Firefox browser to be used by the crawler.
      // If launcher option is not specified here,
      // default Chromium browser will be used.
      launcher: firefox,
    },
    maxRequestsPerCrawl: 5000,
    maxRequestRetries: 10,
    maxRequestsPerMinute: 300,
    maxConcurrency: 2,
    browserPoolOptions: {
      useFingerprints: true,
    },
  });
  try {
    await crawler.run(crawlerGmgnUrlConfigs);
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
