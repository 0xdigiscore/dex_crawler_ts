import { createPlaywrightRouter } from 'crawlee';
import { signalHandler } from './handler/signalHandler.js';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ page, request }) => {
  const title = await page.title();
  console.log(`URL: ${request.url}`);
  console.log(`Title: ${title}`);
});

router.addHandler('gmgn/signals', signalHandler);
