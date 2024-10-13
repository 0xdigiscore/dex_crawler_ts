import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { chromium } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import {
  Token,
  DextoolsResponse,
  DextoolsResult,
  TokenMetrics,
} from '@/interfaces.js';

// Main function to update token metrics
async function updateTokenMetrics(): Promise<void> {
  try {
    // Fetch tokens from the database
    const tokens: Token[] = await prisma.token.findMany({
      where: { chain: 'eth' },
      orderBy: { created_at: 'desc' },
      select: {
        chain: true,
        token_address: true,
        created_at: true,
      },
    });
    console.log(`Found ${tokens.length} tokens in the database.`);

    // Build request list
    const requests = tokens.map((token) => ({
      url: `https://www.dextools.io/shared/search/pair?query=${token.token_address}&strict=true`,
      userData: { token },
    }));
    const proxyConfiguration = new ProxyConfiguration({
      proxyUrls: [process.env.PROXY_URL],
    });

    // Initialize PlaywrightCrawler
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 180,
      maxConcurrency: 6,
      proxyConfiguration,
      launchContext: {
        launcher: chromium,
        launchOptions: {
          headless: true,
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
      requestHandler: async ({ request, page, log }) => {
        const { token } = request.userData as { token: Token };
        try {
          await page.goto(request.url);
          const responseText = await page.evaluate(
            () => document.body.innerText,
          );
          const jsonData: DextoolsResponse = JSON.parse(responseText);

          if (jsonData.results && jsonData.results.length > 0) {
            const result = jsonData.results[0];
            const tokenMetrics = parseTokenMetrics(token, result);
            console.log(tokenMetrics);
            await updateTokenMetricsInDatabase(tokenMetrics);
            log.info(`Token ${token.token_address} metrics updated.`);
          } else {
            log.error(`No results found for token ${token.token_address}`);
          }
        } catch (error) {
          log.error(`Error processing token ${token.token_address}: ${error}`);
        }
      },
    });

    // Start crawling
    await crawler.run(requests);
    console.log('All token metrics updated.');
  } catch (error) {
    console.error('Error updating token metrics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to parse DextoolsResult into TokenMetrics
function parseTokenMetrics(token: Token, result: DextoolsResult): TokenMetrics {
  const metrics = result.metrics;
  const periodStats = result.periodStats;
  const price = result.price;
  const timestamp = result.price_timestamp
    ? Math.floor(new Date(result.price_timestamp).getTime() / 1000)
    : Math.floor(Date.now() / 1000);

  const token_deploy_timestamp = Math.floor(
    new Date(result.creationTime).getTime() / 1000,
  );

  const tokenMetrics: TokenMetrics = {
    chain: token.chain,
    token_address: token.token_address,
    //@ts-ignore
    timestamp: BigInt(timestamp),
    token_deploy_timestamp: BigInt(token_deploy_timestamp),
    price: price,
    liquidity: metrics.liquidity,
    swaps: metrics.txCount,
    volume_24h: periodStats['24h']?.volume?.total || 0,
    buys: periodStats['24h']?.swaps?.buys || 0,
    sells: periodStats['24h']?.swaps?.sells || 0,
    price_change_1h: periodStats['1h']?.price?.usd?.diff || 0,
    price_change_24h: periodStats['24h']?.price?.usd?.diff || 0,
    transactions_1h_buys: periodStats['1h']?.swaps?.buys || 0,
    transactions_1h_sells: periodStats['1h']?.swaps?.sells || 0,
    transactions_24h_buys: periodStats['24h']?.swaps?.buys || 0,
    transactions_24h_sells: periodStats['24h']?.swaps?.sells || 0,
    holder_count: result.token?.metrics?.holders || 0,
    //@ts-ignore
    tx_count: result.token?.metrics?.txCount || 0,

    holdersUpdatedAt: result.token?.metrics?.holdersUpdatedAt,
    market_cap: result.token?.metrics?.fdv || 0,
    fully_diluted_valuation: result.token?.metrics?.fdv || 0,

    pair_address: result.id.pair,
    initial_liquidity: result.metrics.initialLiquidity,
    initial_liquidity_updated_at: result.metrics.initialLiquidityUpdatedAt,
    reserve: result.metrics.reserve,
  };

  return tokenMetrics;
}

// Function to update the TokenMetrics in the database
async function updateTokenMetricsInDatabase(metrics: TokenMetrics) {
  try {
    await prisma.tokenMetrics.upsert({
      where: {
        chain_token_address_timestamp: {
          chain: metrics.chain,
          token_address: metrics.token_address,
          //@ts-ignore
          timestamp: metrics.timestamp,
        },
      },
      update: {},
      create: {
        chain: metrics.chain,
        token_address: metrics.token_address,
        //@ts-ignore
        timestamp: metrics.timestamp,
        price: metrics.price,
        market_cap: metrics.market_cap,
        fully_diluted_valuation: metrics.fully_diluted_valuation,
        liquidity: metrics.liquidity,
        volume_24h: metrics.volume_24h,
        holder_count: metrics.holder_count,
        holdersUpdatedAt: metrics.holdersUpdatedAt,
        swaps: metrics.swaps,
        buys: metrics.buys,
        sells: metrics.sells,
        price_change_1h: metrics.price_change_1h,
        price_change_24h: metrics.price_change_24h,
        price_change_percent: metrics.price_change_percent,
        price_change_percent1h: metrics.price_change_percent1h,
        price_change_percent1m: metrics.price_change_percent1m,
        price_change_percent5m: metrics.price_change_percent5m,
        transactions_1h_buys: metrics.transactions_1h_buys,
        transactions_1h_sells: metrics.transactions_1h_sells,
        transactions_24h_buys: metrics.transactions_24h_buys,
        transactions_24h_sells: metrics.transactions_24h_sells,
        smart_buy_24h: metrics.smart_buy_24h,
        smart_sell_24h: metrics.smart_sell_24h,
        pair_address: metrics.pair_address,
        tx_count: metrics.tx_count,
        initial_liquidity: metrics.initial_liquidity,
        reserve: metrics.reserve,
      },
    });
    // Update Token deploy_time
    await prisma.token.update({
      where: {
        chain_token_address: {
          chain: metrics.chain,
          token_address: metrics.token_address,
        },
      },
      data: {
        deploy_time: metrics.token_deploy_timestamp
          ? BigInt(metrics.token_deploy_timestamp.toString())
          : null,
      },
    });
  } catch (error) {
    console.error('Error updating token metrics in the database:', error);
    throw error;
  }
}

export default updateTokenMetrics;
