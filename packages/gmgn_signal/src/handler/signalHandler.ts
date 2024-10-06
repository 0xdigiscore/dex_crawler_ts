import { storeSignals } from '@/models/signalModel.js';
import { GmgnSignalData } from '@/models/types.js';
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
      const signals: GmgnSignalData[] = data.signals;

      try {
        const storedSignals = await storeSignals(signals);
        log.info(`Successfully stored ${storedSignals.length} signals.`);
      } catch (error) {
        log.error(`Error storing signals: ${error.message}`);
      }
    } else {
      log.error(`Failed to fetch data from ${request.url}`);
    }
  } else {
    log.error(`Failed to fetch data from ${request.url}`);
  }
}
