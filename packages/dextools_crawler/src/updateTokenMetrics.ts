import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { chromium } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import {
  Token,
  DextoolsResponse,
  DextoolsResult,
  TokenMetrics,
  TokenSecurityData,
} from '@/interfaces.js';
import { safeCompare } from './utils.js';

// Main function to update token metrics
async function updateTokenMetrics(): Promise<void> {
  try {
    const tokens = await fetchTokensFromDatabase();
    const requests = buildRequestList(tokens);
    const crawler = initializeCrawler();

    await crawler.run(requests);
    console.log('All token metrics updated.');
  } catch (error) {
    console.error('Error updating token metrics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function fetchTokensFromDatabase(): Promise<Token[]> {
  // Fetch tokens from the database
  const tokens: Token[] = await prisma.token.findMany({
    //where: { chain: 'eth' },
    orderBy: { created_at: 'desc' },
    select: {
      chain: true,
      token_address: true,
      created_at: true,
    },
  });
  console.log(`Found ${tokens.length} tokens in the database.`);
  return tokens;
}

function buildRequestList(tokens: Token[]): any[] {
  // Build request list
  return tokens.map((token) => ({
    url: `https://www.dextools.io/shared/search/pair?query=${token.token_address.toLowerCase()}&strict=true`,
    userData: { token },
  }));
}

function initializeCrawler(): PlaywrightCrawler {
  const proxyConfiguration = new ProxyConfiguration({
    proxyUrls: [process.env.PROXY_URL],
  });

  return new PlaywrightCrawler({
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
    preNavigationHooks: [setupRequestInterception],
    requestHandler: handleRequest,
    failedRequestHandler: async ({ request, error, retryCount }) => {
      console.warn(
        `Request for ${request.url} failed with error: ${error}. Retry count: ${retryCount}`,
      );
      if (typeof retryCount === 'number' && retryCount > 3) {
        console.warn(`Retrying ${request.url} without proxy.`);
        // Retry the request without proxy
        const crawlerWithoutProxy = new PlaywrightCrawler({
          requestHandlerTimeoutSecs: 180,
          maxConcurrency: 6,
          launchContext: {
            launcher: chromium,
            launchOptions: {
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
          },
          preNavigationHooks: [setupRequestInterception],
          requestHandler: handleRequest,
        });
        await crawlerWithoutProxy.run([request]);
      } else {
        console.error(
          `Failed to process ${request.url} after retries with and without proxy.`,
        );
      }
    },
  });
}

async function setupRequestInterception({ page }) {
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
}

async function handleRequest({ request, page, log }) {
  const { token } = request.userData as { token: Token };
  try {
    const jsonData = await fetchDextoolsData(page, request.url);
    if (jsonData.results && jsonData.results.length > 0) {
      // Find the result with the highest metrics.fdv
      const bestResult = jsonData.results.reduce((max, current) => {
        const maxFdv = Number(max.token?.metrics?.fdv || '0');
        const currentFdv = Number(current.token?.metrics?.fdv || '0');
        return safeCompare(currentFdv, maxFdv) > 0 ? current : max;
      }, jsonData.results[0]);
      await processTokenData(token, bestResult, log);
    } else {
      log.error(`No results found for token ${token.token_address}`);
    }
  } catch (error) {
    log.error(`Error processing token ${token.token_address}: ${error}`);
  }
}

async function fetchDextoolsData(page, url): Promise<DextoolsResponse> {
  await page.goto(url);
  const responseText = await page.evaluate(() => document.body.innerText);
  return JSON.parse(responseText);
}

async function processTokenData(
  token: Token,
  result: DextoolsResult,
  log: any,
) {
  const tokenMetrics = parseTokenMetrics(token, result);
  await updateTokenMetricsInDatabase(tokenMetrics);
  log.info(`Token ${token.token_address} metrics updated.`);

  // if (token.chain === 'sol') {
  //   const tokenSecurity = parseTokenSecurity(token, result);
  //   if (tokenSecurity) {
  //     await updateTokenSecurityInDatabase(tokenSecurity);
  //   }
  // }
}

// Function to parse DextoolsResult into TokenMetrics
function parseTokenMetrics(token: Token, result: DextoolsResult): TokenMetrics {
  const metrics = result.metrics;
  const periodStats = result.periodStats || {};

  const price = result.price;
  const timestamp = result.price_timestamp
    ? Math.floor(new Date(result.price_timestamp).getTime() / 1000)
    : Math.floor(Date.now() / 1000);

  // Assign current timestamp if result.creationTime is null
  const token_deploy_timestamp = result.creationTime
    ? Math.floor(new Date(result.creationTime).getTime() / 1000)
    : Math.floor(Date.now() / 1000);

  const tokenMetrics: TokenMetrics = {
    chain: token.chain,
    token_address: token.token_address,
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

// Function to convert 'yes', 'no', 'unknown' to integers
function parseYesNoUnknown(value: string): number | null {
  if (value === 'yes') return 1;
  if (value === 'no') return 0;
  return null;
}

// Function to parse Token Security Data and map to database schema
function parseTokenSecurity(
  token: Token,
  result: DextoolsResult,
): TokenSecurityData | null {
  const auditData = result.token?.audit;
  if (!auditData) {
    return null;
  }

  const { dextools } = auditData;
  if (!dextools) {
    return null;
  }

  const tokenSecurityData: TokenSecurityData = {
    chain: token.chain,
    token_address: token.token_address,
    is_contract_renounced: parseYesNoUnknown(dextools.is_contract_renounced),
    is_open_source: parseYesNoUnknown(dextools.is_open_source),
    is_honeypot: parseYesNoUnknown(dextools.is_honeypot),
    is_mintable: parseYesNoUnknown(dextools.is_mintable),
    is_proxy: parseYesNoUnknown(dextools.is_proxy),
    slippage_modifiable: parseYesNoUnknown(dextools.slippage_modifiable),
    is_blacklisted: parseYesNoUnknown(dextools.is_blacklisted),
    transfer_pausable: parseYesNoUnknown(dextools.transfer_pausable),
    buy_tax: parseTax(dextools.buy_tax),
    sell_tax: parseTax(dextools.sell_tax),
  };
  console.log(tokenSecurityData);

  return tokenSecurityData;
}

function parseTax(taxData: {
  min?: string;
  max?: string;
  status?: string;
}): string | null {
  if (taxData.min !== undefined) {
    return taxData.min;
  }
  if (taxData.max !== undefined) {
    return taxData.max;
  }
  return null;
}

// Function to update the TokenMetrics in the database
async function updateTokenMetricsInDatabase(metrics: TokenMetrics) {
  try {
    await prisma.tokenMetrics.upsert({
      where: {
        chain_token_address_timestamp: {
          chain: metrics.chain,
          token_address: metrics.token_address,
          timestamp: BigInt(metrics.timestamp.toString()),
        },
      },
      update: {},
      create: {
        chain: metrics.chain,
        token_address: metrics.token_address,
        timestamp: BigInt(metrics.timestamp.toString()),
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

async function updateTokenSecurityInDatabase(
  securityData: TokenSecurityData,
): Promise<void> {
  try {
    await prisma.tokenSecurity.upsert({
      where: {
        chain_token_address: {
          chain: securityData.chain,
          token_address: securityData.token_address,
        },
      },
      create: {
        token: {
          connect: {
            chain_token_address: {
              chain: securityData.chain,
              token_address: securityData.token_address,
            },
          },
        },
        anti_whale_modifiable: securityData.anti_whale_modifiable,
        buy_tax: securityData.buy_tax,
        can_take_back_ownership: securityData.can_take_back_ownership,
        cannot_buy: securityData.cannot_buy,
        cannot_sell_all: securityData.cannot_sell_all,
        creator_address: securityData.creator_address,
        creator_balance: securityData.creator_balance,
        creator_percent: securityData.creator_percent,
        external_call: securityData.external_call,

        is_anti_whale: securityData.is_anti_whale,
        is_blacklisted: securityData.is_blacklisted,
        is_honeypot: securityData.is_honeypot,
        is_in_dex: securityData.is_in_dex,
        is_mintable: securityData.is_mintable,
        is_open_source: securityData.is_open_source,
        is_proxy: securityData.is_proxy,
        is_whitelisted: securityData.is_whitelisted,
        lp_holder_count: securityData.lp_holder_count,
        lp_total_supply: securityData.lp_total_supply,
        note: securityData.note,
        other_potential_risks: securityData.other_potential_risks,
        owner_address: securityData.owner_address,
        owner_balance: securityData.owner_balance,
        owner_change_balance: securityData.owner_change_balance,
        owner_percent: securityData.owner_percent,
        selfdestruct: securityData.selfdestruct,
        sell_tax: securityData.sell_tax,
        token_name: securityData.token_name,
        token_symbol: securityData.token_symbol,
        total_supply: securityData.total_supply,
        trading_cooldown: securityData.trading_cooldown,
        transfer_pausable: securityData.transfer_pausable,
        trust_list: securityData.trust_list,
        hidden_owner: securityData.hidden_owner,
        updated_at: new Date(),
      },
      update: {
        anti_whale_modifiable: securityData.anti_whale_modifiable,
        buy_tax: securityData.buy_tax,
        can_take_back_ownership: securityData.can_take_back_ownership,
        cannot_buy: securityData.cannot_buy,
        cannot_sell_all: securityData.cannot_sell_all,
        creator_address: securityData.creator_address,
        creator_balance: securityData.creator_balance,
        creator_percent: securityData.creator_percent,
        external_call: securityData.external_call,

        is_anti_whale: securityData.is_anti_whale,
        is_blacklisted: securityData.is_blacklisted,
        is_honeypot: securityData.is_honeypot,
        is_in_dex: securityData.is_in_dex,
        is_mintable: securityData.is_mintable,
        is_open_source: securityData.is_open_source,
        is_proxy: securityData.is_proxy,
        is_whitelisted: securityData.is_whitelisted,
        lp_holder_count: securityData.lp_holder_count,
        lp_total_supply: securityData.lp_total_supply,
        note: securityData.note,
        other_potential_risks: securityData.other_potential_risks,
        owner_address: securityData.owner_address,
        owner_balance: securityData.owner_balance,
        owner_change_balance: securityData.owner_change_balance,
        owner_percent: securityData.owner_percent,
        selfdestruct: securityData.selfdestruct,
        sell_tax: securityData.sell_tax,
        token_name: securityData.token_name,
        token_symbol: securityData.token_symbol,
        total_supply: securityData.total_supply,
        trading_cooldown: securityData.trading_cooldown,
        transfer_pausable: securityData.transfer_pausable,
        trust_list: securityData.trust_list,
        hidden_owner: securityData.hidden_owner,
        updated_at: new Date(),
      },
    });

    console.log(
      `Token security data for ${securityData.token_address} on ${securityData.chain} updated/created successfully.`,
    );
  } catch (error) {
    console.error(
      `Error updating/creating token security data for ${securityData.token_address} on ${securityData.chain}:`,
      error,
    );
    throw error;
  }
}

export default updateTokenMetrics;
