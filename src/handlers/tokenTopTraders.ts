import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { URL } from "url";
import { upsertTopTraders } from "@/models/topTraderModel.js";

export async function topTokenTraders({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing Token Top Traders: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();

    // Extract the data array from the response
    const { code, msg, data } = jsonResponse;

    if (code === 0 && Array.isArray(data)) {
      // Extract chain and tokenAddress from the request URL
      const { chain, tokenAddress } = extractTokenInfoFromRequest(request.url);

      try {
        await upsertTopTraders(chain, tokenAddress, data);
        log.info(
          `Processed ${data.length} top traders for token ${tokenAddress} on ${chain}`
        );
      } catch (error) {
        log.error(`Error processing top traders: ${error}`);
      }
    } else {
      log.error(`Failed to process response: ${msg}`);
    }
  }
}

// Updated extractTokenInfoFromRequest function
function extractTokenInfoFromRequest(url: string): {
  chain: string;
  tokenAddress: string;
} {
  const parsedUrl = new URL(url);
  const pathnameParts = parsedUrl.pathname.split("/").filter(Boolean);

  // Adjust indices based on your actual URL structure
  const len = pathnameParts.length;
  const chain = pathnameParts[len - 2];
  const tokenAddress = pathnameParts[len - 1];

  return { chain, tokenAddress };
}
