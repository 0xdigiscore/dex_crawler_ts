import {
  PlaywrightCrawler,
  PlaywrightCrawlerOptions,
  ProxyConfiguration,
} from 'crawlee';
import { firefox } from 'playwright';

const gmgn = (options: PlaywrightCrawlerOptions) => {
  return new PlaywrightCrawler({
    useSessionPool: true,
    persistCookiesPerSession: true,
    proxyConfiguration: new ProxyConfiguration({
      proxyUrls: [process.env.PROXY_URL],
    }),
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
    maxRequestsPerCrawl: 5000,
    maxRequestRetries: 10,
    maxRequestsPerMinute: 300,
    maxConcurrency: 2,
    browserPoolOptions: {
      useFingerprints: true,
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
            referer: 'https://gmgn.ai/',

            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          };

          // Continue the request with modified headers
          route.continue({ headers });
        });
      },
    ],
    ...options,
  });
};

export default gmgn;
