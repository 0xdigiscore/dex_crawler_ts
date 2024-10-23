import { CrawlingContext } from 'crawlee';
import { Response } from 'playwright';
import { parseAndSaveHotTokens } from '../models/tokenModel.js';
import { generateTopTradersUrl } from '@/utils/urlGenerate.js';

export async function rankEthTokens({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing Eth Rank Tokens: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    log.info(`Response received successfully`);

    // Call parseAndSaveTokens function
    await parseAndSaveHotTokens(jsonResponse.data.rank);
    const addresses =
      jsonResponse?.data?.rank?.map((item: any) => item.address) || [];
    if (addresses.length === 0) {
      log.info('No addresses found in jsonResponse.data.data.rank');
    }

    // const newUrls = [];
    // for (const address of addresses) {
    //   newUrls.push(generateTopTradersUrl(address));
    // }
    // await enqueueLinks({ urls: newUrls, label: 'top/token/traders' });
  } else {
    log.error(`Failed to fetch data from ${request.url}`);
  }
}
