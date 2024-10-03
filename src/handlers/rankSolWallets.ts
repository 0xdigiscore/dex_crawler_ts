import { CrawlingContext } from "crawlee";
import { Response } from "playwright";

export async function rankSolWallets({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing Sol Rank Tokens: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
  }
}
