import { RequestOptions } from 'crawlee';

interface CrawlerUrlConfig extends RequestOptions {
  datasetName: string;
}

export const crawlerGmgnUrlConfigs: CrawlerUrlConfig[] = [
  {
    url: 'https://gmgn.ai/defi/quotation/v1/rank/eth/swaps/1h?orderby=smartmoney&direction=desc&filters[]=not_honeypot&filters[]=verified&filters[]=renounced',
    label: 'rank/eth/swaps',
    datasetName: 'eth_swaps_tokens',
  },
  {
    url: 'https://gmgn.ai/defi/quotation/v1/rank/sol/swaps/1h?orderby=smartmoney&direction=desc&filters[]=renounced&filters[]=frozen',
    label: 'rank/sol/swaps',
    datasetName: 'sol_swaps_tokens',
  },
  {
    url: 'https://gmgn.ai/defi/quotation/v1/rank/eth/wallets/7d?tag=smart_degen&tag=pump_smart&orderby=pnl_7d&direction=desc',
    label: 'rank/eth/wallets',
    datasetName: 'eth_smart_wallets_tokens',
  },
  {
    url: 'https://gmgn.ai/defi/quotation/v1/rank/sol/wallets/7d?orderby=pnl_7d&direction=desc',
    label: 'rank/sol/wallets',
    datasetName: 'sol_smart_wallets_tokens',
  },
  {
    url: 'https://1step.app/api/smartMoneyList?chainId=0x1&time=7day',
    label: '1step/eth/wallets',
    datasetName: '1step_eth_wallets',
  },
  {
    url: 'https://gmgn.ai/defi/quotation/v1/tokens/top_buyers/eth/0xa73b792906c79509d73fdfaaa78561e195010706',
    label: 'top/buyers',
    datasetName: 'top_buyers',
  },
];

export const getDatasetName = (url: string): string => {
  const config = crawlerGmgnUrlConfigs.find((cfg) => url.includes(cfg.label!));
  return config ? config.datasetName : 'default';
};

export const startUrls: RequestOptions[] = crawlerGmgnUrlConfigs;
