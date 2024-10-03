import { PlaywrightCrawler, RequestOptions } from "crawlee";
import { router } from "@/routes.js";

// Define start URLs with explicit labels
const startUrls: RequestOptions[] = [
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/eth/swaps/1h?orderby=smartmoney&direction=desc&filters[]=not_honeypot&filters[]=verified&filters[]=renounced",
    label: "rank/eth/swaps",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/1h?orderby=smartmoney&direction=desc&filters[]=renounced&filters[]=frozen",
    label: "rank/sol/swaps",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/eth/wallets/7d?orderby=pnl_7d&direction=desc",
    label: "rank/eth/wallets",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/sol/wallets/7d?orderby=pnl_7d&direction=desc",
    label: "rank/sol/wallets",
  },
];

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
