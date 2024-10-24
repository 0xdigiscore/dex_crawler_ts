import { upsertTopBuyers } from '@/models/topBuyersModel.js';
import { generateWalletActivityUrl } from '@/utils/urlGenerate.js';
import { CrawlingContext } from 'crawlee';
import { Response } from 'playwright';
import { URL } from 'url';

export async function topBuyers({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing Top Buyers: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();

    // Extract the data array from the response
    const { code, msg, data } = jsonResponse;

    if (code === 0 && Array.isArray(data.holders.holderInfo)) {
      const { chain } = extractTokenInfoFromRequest(request.url);
      try {
        await upsertTopBuyers(chain, data.holders.holderInfo);

        const newUrls = [];
        for (const holderInfo of data.holders.holderInfo) {
          const walletAddress = holderInfo.wallet_address;
          // 这里抓取代币的activity 数据
          newUrls.push(generateWalletActivityUrl(walletAddress, chain));
        }

        await enqueueLinks({
          urls: newUrls,
          label: 'smart/wallet/activity',
        });
      } catch (error) {
        log.error(`Error processing top traders: ${error}`);
      }
    } else {
      log.error(`Failed to process response: ${msg}`);
    }
  }
}

function extractTokenInfoFromRequest(url: string): {
  chain: string;
  tokenAddress: string;
} {
  const parsedUrl = new URL(url);
  const pathnameParts = parsedUrl.pathname.split('/').filter(Boolean);
  // Adjust indices based on your actual URL structure
  const len = pathnameParts.length;
  const chain = pathnameParts[len - 2];
  const tokenAddress = pathnameParts[len - 1];

  return { chain, tokenAddress };
}
