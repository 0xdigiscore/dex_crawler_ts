import { PlaywrightCrawler, ProxyConfiguration } from "crawlee";
import { router } from "@/routes.js";
import { firefox } from "playwright";
import { crawlerGmgnUrlConfigs } from "./const/crawlerUrls.js";

const proxyConfiguration = new ProxyConfiguration({
  proxyUrls: [process.env.PROXY_URL as string],
});
const crawler = new PlaywrightCrawler({
  requestHandler: router,
  // Unified Cookies Management and Rate Limiting
  sessionPoolOptions: {
    maxPoolSize: 10,
  },
  launchContext: {
    // Set the Firefox browser to be used by the crawler.
    // If launcher option is not specified here,
    // default Chromium browser will be used.
    launcher: firefox,
  },
  maxRequestsPerCrawl: 2000,
  maxRequestRetries: 10,
  maxRequestsPerMinute: 80,
  maxConcurrency: 2,
  browserPoolOptions: {
    useFingerprints: true,
  },
});

await crawler.run(crawlerGmgnUrlConfigs);
