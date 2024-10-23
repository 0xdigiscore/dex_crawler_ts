import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { router } from '@/routes.js';
import { firefox, chromium } from 'playwright';
import { crawlerGmgnUrlConfigs } from '@/const/crawlerUrls.js';

const proxyConfiguration = new ProxyConfiguration({
  proxyUrls: [process.env.PROXY_URL],
});

async function main() {
  const crawler = new PlaywrightCrawler({
    useSessionPool: true,
    persistCookiesPerSession: true,
    proxyConfiguration,
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
      launchOptions: {
        ignoreHTTPSErrors: true, // 忽略 https 证书错误
      },
    },
    // Use preNavigationHooks to modify headers before navigation
    preNavigationHooks: [
      async ({ page, request, log }, gotoOptions) => {
        // Set up request interception
        await page.route('**', (route) => {
          const headers = {
            ...route.request().headers(),
            accept: 'application/json',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            referer: 'https://gmgn.ai',

            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          };

          // Continue the request with modified headers
          route.continue({ headers });
        });
      },
    ],

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
