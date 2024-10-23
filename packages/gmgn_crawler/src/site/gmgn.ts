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
    ...options,
  });
};

export default gmgn;
