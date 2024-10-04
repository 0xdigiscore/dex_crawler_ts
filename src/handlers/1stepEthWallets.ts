import { CrawlingContext, EnqueueStrategy } from "crawlee";
import { Response } from "playwright";

export async function oneStepEthWallets({
  request,
  log,
  response,
  enqueueLinks,
}: CrawlingContext) {
  log.info(`Processing 1step ETH Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;
    console.log(`1step eth wallets request url: ${request.url}`);
    console.log(data);

    let addresses = data?.map((item: any) => item.address) || [];
    if (addresses.length === 0) {
      log.info("No addresses found in jsonResponse.data.data.rank");
    }

    console.log(addresses);
    addresses = addresses.slice(0, 450);
    for (const address of addresses) {
      const newUrl = `https://gmgn.ai/defi/quotation/v1/smartmoney/eth/walletNew/${address}?period=7d`;

      await enqueueLinks({
        urls: [newUrl],
        label: "smart/new/wallet",
        strategy: EnqueueStrategy.All,
      });
    }
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
