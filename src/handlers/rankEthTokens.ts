import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveTokens } from "../models/tokenModel.js";
import { getDatasetName } from "@/const/crawlerUrls.js";
import { storeData } from "@/utils/storedata.js";

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

    const datasetName = getDatasetName(request.url);

    // Call parseAndSaveTokens function
    await parseAndSaveTokens(jsonResponse);
    const addresses =
      jsonResponse?.data?.rank?.map((item: any) => item.address) || [];
    if (addresses.length === 0) {
      log.info("No addresses found in jsonResponse.data.data.rank");
    }
    for (const address of addresses) {
      const newUrl = `https://gmgn.ai/defi/quotation/v1/tokens/top_traders/eth/${address}?orderby=realized_profit&direction=desc&tag=smart_degen`;

      await enqueueLinks({ urls: [newUrl], label: "top/token/traders" });
    }
    await storeData(request.url, jsonResponse, datasetName, log);
  } else {
    log.error(`Failed to fetch data from ${request.url}`);
  }
}
