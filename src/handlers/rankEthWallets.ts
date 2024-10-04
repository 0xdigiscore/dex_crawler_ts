import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveWallets } from "@/models/walletModel.js";
import { getDatasetName } from "@/const/crawlerUrls.js";
import { storeData } from "@/utils/storedata.js";

export async function rankEthWallets({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing ETH Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;
    console.log(`rank eth wallets request url: ${request.url}`);

    // 假设 data.rank 是钱包数据的数组
    const walletsData = Array.isArray(data.rank) ? data.rank : [data.rank];
    const datasetName = getDatasetName(request.url);
    await storeData(request.url, data, datasetName, log);

    await parseAndSaveWallets(walletsData, "eth", "gmgn", log);
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
