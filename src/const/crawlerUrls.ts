import { RequestOptions } from "crawlee";

interface CrawlerUrlConfig extends RequestOptions {
  datasetName: string;
}

export const crawlerUrlConfigs: CrawlerUrlConfig[] = [
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/eth/swaps/1h?orderby=smartmoney&direction=desc&filters[]=not_honeypot&filters[]=verified&filters[]=renounced",
    label: "rank/eth/swaps",
    datasetName: "eth_swaps_tokens",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/1h?orderby=smartmoney&direction=desc&filters[]=renounced&filters[]=frozen",
    label: "rank/sol/swaps",
    datasetName: "sol_swaps_tokens",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/eth/wallets/7d?orderby=pnl_7d&direction=desc",
    label: "rank/eth/wallets",
    datasetName: "eth_smart_wallets_tokens",
  },
  {
    url: "https://gmgn.ai/defi/quotation/v1/rank/sol/wallets/7d?orderby=pnl_7d&direction=desc",
    label: "rank/sol/wallets",
    datasetName: "sol_smart_wallets_tokens",
  },
];

export const getDatasetName = (url: string): string => {
  const config = crawlerUrlConfigs.find((cfg) => url.includes(cfg.label!));
  return config ? config.datasetName : "default";
};

export const startUrls: RequestOptions[] = crawlerUrlConfigs;
