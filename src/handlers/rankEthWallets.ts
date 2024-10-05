import { CrawlingContext, EnqueueStrategy } from "crawlee";
import { Response } from "playwright";
import {
  parseAndSaveWallets,
  extractWalletAddressFromUrl,
} from "@/models/walletModel.js";
import { getDatasetName } from "@/const/crawlerUrls.js";
import { storeData } from "@/utils/storedata.js";

export async function rankEthWallets({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing ETH Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;
    console.log(`rank eth wallets request url: ${request.url}`);

    // 假设 data.rank 是钱包数据的数组
    const walletsData = Array.isArray(data.rank) ? data.rank : [data.rank];
    const datasetName = getDatasetName(request.url);
    //await storeData(request.url, data, datasetName, log);

    for (const wallet of walletsData) {
      const walletAddress = wallet.wallet_address || wallet.address || "";
      // 这里抓取代币的activity 数据
      const newUrl = `https://gmgn.ai/defi/quotation/v1/wallet_activity/eth?type=buy&type=sell&wallet=${walletAddress}&limit=10&cost=10`;
      await enqueueLinks({
        urls: [newUrl],
        label: "smart/wallet/activity",
        strategy: EnqueueStrategy.All,
      });
    }

    await parseAndSaveWallets(walletsData, "eth", "gmgn", log);
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
