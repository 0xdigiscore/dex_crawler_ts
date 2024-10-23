import { generateWalletUrl } from '@/utils/urlGenerate.js';
import { CrawlingContext, EnqueueStrategy } from 'crawlee';
import { Response } from 'playwright';

export async function oneStepEthWallets({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing 1step ETH Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;
    log.info(`1step eth wallets request url: ${request.url}`);

    const filteredAddresses = data
      ?.filter((item: any) => Number(item.average_holding_time) >= 60)
      .map((item: any) => item.address);

    if (filteredAddresses.length === 0) {
      log.info('No valid addresses found');
    } else {
      const newUrls = [];
      for (const address of filteredAddresses) {
        newUrls.push(generateWalletUrl(address));
      }
      await enqueueLinks({
        urls: newUrls,
        label: 'smart/new/wallet',
        strategy: EnqueueStrategy.All,
      });
    }
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
