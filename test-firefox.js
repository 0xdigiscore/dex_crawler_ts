// test.js

import { PlaywrightCrawler } from 'crawlee';
import { chromium } from 'playwright';

async function crawl(url) {
  // Initialize PlaywrightCrawler
  const crawler = new PlaywrightCrawler({
    requestHandlerTimeoutSecs: 180,
    maxConcurrency: 1, // Adjust concurrency as needed
    launchContext: {
      launcher: chromium,
      launchOptions: {
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
    // Use preNavigationHooks to modify headers before navigation
    preNavigationHooks: [
      async ({ page, request, log }, gotoOptions) => {
        // Set up request interception
        await page.route('**', (route) => {
          const headers = {
            ...route.request().headers(),
            accept: 'application/json',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            referer: 'https://www.dextools.io',

            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          };

          // Continue the request with modified headers
          route.continue({ headers });
        });
      },
    ],
    requestHandler: async ({ request, page, response, log }) => {
      try {
        console.log(`Processing ${request.url}...`);

        // Navigate to the target URL
        await page.goto(request.url, {
          waitUntil: 'networkidle',
          timeout: 60000,
        });

        // Get the response content
        const content = await page.content();
        console.log('Response received successfully');
        console.log('Content:', content);

        // Further processing can be done here, such as parsing JSON or saving to a file
      } catch (error) {
        log.error('An error occurred:', error);
      }
    },
  });

  // Start crawling
  await crawler.run([{ url }]);
}

// Example usage
const targetUrl =
  'https://www.dextools.io/shared/exchanges?allowUnknowns=false&chain=ether';
crawl(targetUrl);
