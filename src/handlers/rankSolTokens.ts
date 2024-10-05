import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveHotTokens } from "@/models/tokenModel.js";

export async function rankSolTokens({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing SOL Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    console.log(`rank sol wallets request url: ${request.url}`);

    await parseAndSaveHotTokens(jsonResponse.data.rank);
    const addresses =
      jsonResponse?.data?.rank?.map((item: any) => item.address) || [];
    if (addresses.length === 0) {
      log.info("No addresses found in jsonResponse.data.data.rank");
    }
    // for (const address of addresses) {
    //    const newUrl = `https://gmgn.ai/defi/quotation/v1/trades/sol/${address}?limit=100&maker=&tag[]=smart_degen&tag[]=pump_smart`;
    //   await enqueueLinks({ urls: [newUrl], label: "top/token/traders" });
    // }
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
