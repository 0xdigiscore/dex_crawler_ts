import { CrawlingContext } from 'crawlee';
import { Response } from 'playwright';

export async function signalHandler({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing Eth Rank Tokens: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { code, data, msg } = jsonResponse;
    if (code === 0) {
      data.signals.forEach((signal: any) => {
        log.info(`Processing signal: ${JSON.stringify(signal)}`);
      });
      log.info(`Response received successfully`);
    } else {
      log.error(`Failed to fetch data from ${request.url}`);
    }
  } else {
    log.error(`Failed to fetch data from ${request.url}`);
  }
}
