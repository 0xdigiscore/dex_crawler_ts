import { RequestOptions } from 'crawlee';

interface CrawlerUrlConfig extends RequestOptions {
  datasetName: string;
}

export const crawlerGmgnUrlConfigs: CrawlerUrlConfig[] = [
  {
    url: 'https://gmgn.ai/defi/quotation/v1/signals?size=10',
    label: 'gmgn/signals',
    datasetName: 'gmgn_signals',
  },
];

export const startUrls: RequestOptions[] = crawlerGmgnUrlConfigs;
