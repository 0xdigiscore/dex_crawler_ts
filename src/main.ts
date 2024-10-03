import { PlaywrightCrawler } from "crawlee";
import { router } from "@/routes.js";
import { startUrls } from "./const/crawlerUrls.js";

const crawler = new PlaywrightCrawler({
  requestHandler: router,
  // Unified Cookies Management and Rate Limiting
  sessionPoolOptions: {
    maxPoolSize: 10,
  },
  maxRequestsPerCrawl: 100,
  maxConcurrency: 5,
  launchContext: {
    launchOptions: {
      headless: true,
    },
  },
  browserPoolOptions: {
    useFingerprints: true,
  },
});

await crawler.run(startUrls);
