// main.ts

import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { firefox } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import {
  Token,
  RequestType,
  TokenStatsData,
  HolderData,
} from '@/types/interfaces.js';
import { fetchTokenData } from '@/helper/dataFetchers.js';
import {
  //updateTokenSecurityDataInDatabase,
  updateTokenStatsInDatabase,
  updateTopBuysInDatabase,
} from '@/database/index.js';
import {
  TOKEN_CHAIN,
  MAX_CONCURRENCY,
  REQUEST_TIMEOUT,
  BASE_URLS,
} from '@/helper/constants.js';
import { FetchError, DatabaseError } from '@/helper/errorHandling.js';

async function updateTokensData(): Promise<void> {
  try {
    // Fetch tokens from the database
    const tokens: Token[] = await prisma.token.findMany({
      where: { chain: TOKEN_CHAIN },
      orderBy: { created_at: 'desc' },
      select: {
        chain: true,
        token_address: true,
        created_at: true,
      },
    });
    console.log(`Found ${tokens.length} tokens in the database.`);

    // Build and interleave requests
    const requests = buildRequests(tokens);

    const proxyConfiguration = new ProxyConfiguration({
      proxyUrls: [process.env.PROXY_URL],
    });

    // Initialize PlaywrightCrawler
    const crawler = new PlaywrightCrawler({
      useSessionPool: true,
      persistCookiesPerSession: true,
      proxyConfiguration,
      requestHandlerTimeoutSecs: REQUEST_TIMEOUT,
      maxConcurrency: MAX_CONCURRENCY,
      launchContext: {
        launcher: firefox,
        launchOptions: {
          headless: true,
          ignoreHTTPSErrors: true,
        },
      },
      requestHandler: async ({ request, page }) => {
        const { token, type } = request.userData as {
          token: Token;
          type: RequestType;
        };
        try {
          const data = await fetchTokenData(page);

          switch (type) {
            case 'stats':
              await updateTokenStatsInDatabase(token, data as TokenStatsData);
              console.log(`Token ${token.token_address} stats updated.`);
              break;
            case 'top_buys':
              const holderData = data.holders as HolderData;
              await updateTopBuysInDatabase(token, holderData);
              console.log(
                `Token ${token.token_address} top buys data updated.`,
              );
              break;
            default:
              throw new Error(`Unknown request type: ${type}`);
          }
        } catch (error) {
          if (error instanceof FetchError || error instanceof DatabaseError) {
            console.error(error.message);
          } else {
            console.error(
              `Unexpected error for token ${token.token_address}: ${error}`,
            );
          }
        }
      },
    });

    // Start crawling
    await crawler.run(requests);
    console.log('All token data updated.');
  } catch (error) {
    console.error(error);
    console.error(`Error updating token data: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

function buildRequests(tokens: Token[]) {
  const securityRequests = [];
  const statsRequests = [];
  const topBuysRequests = [];

  tokens.forEach((token) => {
    statsRequests.push({
      url: `${BASE_URLS.stats}/${TOKEN_CHAIN}/${token.token_address}`,
      userData: { token, type: 'stats' },
    });
    topBuysRequests.push({
      url: `${BASE_URLS.topBuys}/${TOKEN_CHAIN}/${token.token_address}`,
      userData: { token, type: 'top_buys' },
    });
  });

  // Interleave the requests
  const requests = interleaveArrays([
    securityRequests,
    statsRequests,
    topBuysRequests,
  ]);

  return requests;
}

function interleaveArrays(arrays: any[][]): any[] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result = [];
  for (let i = 0; i < maxLength; i++) {
    arrays.forEach((arr) => {
      if (i < arr.length) {
        result.push(arr[i]);
      }
    });
  }
  return result;
}

updateTokensData();
