// test.js

import { PlaywrightCrawler } from 'crawlee';
import { chromium } from 'playwright';

async function crawl(url) {
  // 初始化 PlaywrightCrawler
  const crawler = new PlaywrightCrawler({
    requestHandlerTimeoutSecs: 180,
    maxConcurrency: 1, // 根据需要调整并发数
    launchContext: {
      launcher: chromium,
      launchOptions: {
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
    requestHandler: async ({ request, page, response, log }) => {
      try {
        console.log(`Processing ${request.url}...`);

        // 设置额外的 HTTP 请求头
        await page.setExtraHTTPHeaders({
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer:
            'https://www.dextools.io/app/ether/pair-explorer/0xc555d55279023e732ccd32d812114caf5838fd46',
          Connection: 'keep-alive',
        });

        // 设置 User-Agent
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        );

        // 访问目标URL
        await page.goto(request.url, {
          waitUntil: 'networkidle',
          timeout: 60000,
        });

        // 获取响应内容
        const content = await page.content();
        console.log('Response received successfully');
        console.log('Content:', content);

        // 您可以在这里进一步处理响应内容，例如解析 JSON 或保存到文件
      } catch (error) {
        log.error('An error occurred:', error);
      }
    },
  });

  // 开始爬取
  await crawler.run([{ url }]);
}

// 使用示例
const targetUrl =
  'https://www.dextools.io/shared/data/pair?address=0xc555d55279023e732ccd32d812114caf5838fd46&chain=ether&audit=true&locks=true';
crawl(targetUrl);
