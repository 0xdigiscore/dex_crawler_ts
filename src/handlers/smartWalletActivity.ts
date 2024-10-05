import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import {
  parseAndSaveWalletActivities,
  WalletActivityData,
} from "@/models/activityModel.js";

export async function smartWalletActivity({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing Smart Wallet Activity: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();

    if (jsonResponse.code === 0 && jsonResponse.data) {
      const activities: WalletActivityData[] = jsonResponse.data.activities;
      const urlParams = new URLSearchParams(request.url.split("?")[1]);
      const walletAddress = urlParams.get("wallet");
      if (walletAddress) {
        await parseAndSaveWalletActivities(activities, log, walletAddress);
      } else {
        log.error(`Wallet address not found in the request URL`);
      }
    } else {
      log.error(
        `Invalid response format or no activities found ${request.url}`
      );
    }
  } else {
    log.error(`Failed to fetch data from ${request.url}`);
  }
}
