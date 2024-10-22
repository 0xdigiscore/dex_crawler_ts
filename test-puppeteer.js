// test.js

import { PuppeteerCrawler } from 'crawlee';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use the stealth plugin with puppeteer-extra
puppeteerExtra.use(stealthPlugin());

async function crawl(url) {
  // Initialize PuppeteerCrawler
  const crawler = new PuppeteerCrawler({
    requestHandlerTimeoutSecs: 180,
    maxConcurrency: 1, // Adjust concurrency as needed
    launchContext: {
      // Specify puppeteer-extra as the launcher
      launcher: puppeteerExtra,
      launchOptions: {
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
    // Use preNavigationHooks to modify headers before navigation
    preNavigationHooks: [
      async ({ page, request, log }, gotoOptions) => {
        // Set up request interception
        await page.setRequestInterception(true);
        page.on('request', (interceptedRequest) => {
          // Clone the original headers
          const headers = { ...interceptedRequest.headers() };

          // Modify headers as per your requirement
          headers['accept'] = 'application/json';
          headers['accept-encoding'] = 'gzip, deflate, br, zstd';
          headers['accept-language'] = 'zh-CN,zh;q=0.9,en;q=0.8';
          // headers['authorization'] =
          //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoiVTJGc2RHVmtYMThHdy9vQWxuYWIya2tsbVlLZG85SE4xOGwyWFdGd0NzeUorQVlIR0RER0k3eFZYclVTaEtrSUdqZGNTQnhoUG9od2ppaTVYbGtGeUdzRHNka3NlcWdDVDZETmtLQmxWMUhUYVJYNnlVZWo2Sncrd0poQ0lwcHZGa1NBZ1VXQzlGS1NWeU8vNllGVmdYMUdhUlNqNXdGeE95S2F6cVFUR1kzTSt4UUJBMm14ZXhjaGZpVWl0WGxReTRZbGpaYmhIaXI4aU9jRGdTVnlRMHBEZDBPTXRnd3FBdzdXRmVpWkkvN21saDlRTW9GeGliUzBXTVRDZDRBUkNTTXdmUzh0UVQ1SWhnOVBERW0wejFLUHE3ZHFFMWkvVjJGaDRuT3JPdG89IiwiaWF0IjoxNzI4NzI4NDg2LCJleHAiOjE3Mjg3Mjg4ODZ9.CsOClQXgCYphoC7FZGJbUJUa9iM0kdliuEzWPt4ahPg';
          headers['content-type'] = 'application/json';
          // headers['cookie'] =
          //   '_pk_id.1.b299=0d25cfa6382dd480.1726470163.; _pk_id.5.b299=f15b42d2e098f51f.1726470163.; _ga=GA1.1.743784403.1727445584; _ga_9DZQT74D25=GS1.1.1728465231.4.0.1728465234.0.0.0; cf_clearance=.7BfY.f7Y24bqnE4nnQ44byqhk2EoJcckg5ke8z_5D8-1728728174-1.2.1.1-6IP6M05.kcx432gJ_Z30lQ6vjIMrnX7m1JVqDlbFQ7itb8kLK6C.ZavP_WcdPXP3.r.OppUJMqN0NUnC2mchuTEuNsvpLqGeXHFgiMiM.61qxEjdG1.xrO6b.3NJTz6dZCscRylm5h_NRvwRbN2iJVOJ9ToY2p1zlDipRz1tOGHrKx8Kf2VLCpAsHcZMdK_MnScrEusfRScKabI1XNEOCCTERywSLOpu6J3gaWW_ZpTHp57RTuXOtcDeG.XExVrwYcIMmgKhDgWzqjFqEJExcVrebGt.vdAGH_coP4.zEGPFK1K7QmkrTPY95cQ_8xgAQ8MwW4x0rtXByvIoTCjhDu5oVLQiF1N0wsT7Wvi5ENkZN.M2Bx.Tw3K6xnC_83TS1BUqcaoaCpm0t..JA7nwYw; _pk_ses.1.b299=1; _pk_ses.5.b299=1; __cf_bm=8CGnZTaXLYt0Akm0uITcWVw5rgJ0xeaNJH1OxctQBj4-1728728488-1.0.1.1-f0MgmXduDnaRALWh_W29dR0ZPETvhqhylWetl3JIofkKVKDGttYVkyznMRXUmfB11bIHS6mFIih4jEu5qGB5og';
          // headers['priority'] = 'u=1, i';
          headers['referer'] = 'https://www.dextools.io';
          // headers['sec-ch-ua'] =
          //   '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"';
          // headers['sec-ch-ua-mobile'] = '?0';
          // headers['sec-ch-ua-platform'] = '"macOS"';
          // headers['sec-fetch-dest'] = 'empty';
          // headers['sec-fetch-mode'] = 'cors';
          // headers['sec-fetch-site'] = 'same-origin';
          // headers['user-agent'] =
          //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

          // Continue the request with the modified headers
          interceptedRequest.continue({ headers });
        });
      },
    ],
    requestHandler: async ({ request, page, response, log }) => {
      try {
        console.log(`Processing ${request.url}...`);

        // Navigate to the target URL
        await page.goto(request.url, {
          waitUntil: 'networkidle0',
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
  'https://www.dextools.io/shared/search/pair?query=9MnKTgwFyXJgnZumHGT9NdHuzm98ACjkNwpLniLhpump&strict=true';
crawl(targetUrl);
