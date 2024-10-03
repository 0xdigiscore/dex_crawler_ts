import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveTokens } from "@/models/tokenModel.js";
import { getDatasetName } from "@/const/crawlerUrls.js";
import { storeData } from "@/utils/storedata.js";

export async function rankSolTokens({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing SOL Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;
    console.log(`rank sol wallets request url: ${request.url}`);

    const datasetName = getDatasetName(request.url);
    await storeData(request.url, data, datasetName, log);

    await parseAndSaveTokens(jsonResponse);
    const addresses =
      jsonResponse?.data?.rank?.map((item: any) => item.address) || [];
    if (addresses.length === 0) {
      log.info("No addresses found in jsonResponse.data.data.rank");
    }
    // for (const address of addresses) {
    //   const newUrl = `https://gmgn.ai/defi/quotation/v1/tokens/top_traders/eth/${address}?orderby=realized_profit&direction=desc&tag=smart_degen`;

    //   await enqueueLinks({ urls: [newUrl], label: "top/token/traders" });
    // }
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
