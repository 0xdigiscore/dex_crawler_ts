import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { chromium } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';

// Main function to update Solana token security data
async function updateSolSecurity(): Promise<void> {
  try {
    const tokens = await fetchSolTokensFromDatabase();
    const requests = buildRequestList(tokens);
    const crawler = initializeCrawler();

    await crawler.run(requests);
    console.log('All Solana token security data updated.');
  } catch (error) {
    console.error('Error updating Solana token security data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function fetchSolTokensFromDatabase(): Promise<
  { token_address: string }[]
> {
  // Fetch Solana tokens from the database
  const tokens = await prisma.token.findMany({
    where: { chain: 'sol' },
    orderBy: { created_at: 'desc' },
    select: {
      chain: true,
      token_address: true,
      created_at: true,
    },
  });
  console.log(`Found ${tokens.length} Solana tokens in the database.`);
  return tokens;
}

function buildRequestList(tokens: { token_address: string }[]): any[] {
  // Build request list
  return tokens.map((token) => ({
    url: `https://solsniffer.com/api/v1/sniffer/token/${token.token_address}`,
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
  });
}

async function setupRequestInterception({ page }) {
  // Set up request interception
  await page.route('**', (route) => {
    const headers = {
      ...route.request().headers(),
      accept: 'application/json',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      referer: 'https://solsniffer.com',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    };

    // Continue the request with modified headers
    route.continue({ headers });
  });
}

async function handleRequest({ request, page, log }) {
  const { token } = request.userData as { token: { token_address: string } };
  try {
    const jsonData = await fetchSolSnifferData(page, request.url);
    if (jsonData && jsonData.tokenData && jsonData.tokenData.auditRisk) {
      await processTokenData(token, jsonData.tokenData.auditRisk, log);
    } else {
      log.error(`No auditRisk data found for token ${token.token_address}`);
    }
  } catch (error) {
    log.error(`Error processing token ${token.token_address}: ${error}`);
  }
}

async function fetchSolSnifferData(page, url): Promise<any> {
  await page.goto(url);
  const responseText = await page.evaluate(() => document.body.innerText);
  return JSON.parse(responseText);
}

async function processTokenData(
  token: { token_address: string },
  auditRisk: any,
  log: any,
) {
  const tokenSecurityData = parseTokenSecurity(token, auditRisk);
  if (tokenSecurityData) {
    await updateTokenSecurityInDatabase(tokenSecurityData);
    log.info(`Token ${token.token_address} security data updated.`);
  } else {
    log.error(`No valid security data for token ${token.token_address}`);
  }
}

// Function to parse auditRisk data and map to TokenSecurity schema
function parseTokenSecurity(
  token: { token_address: string },
  auditRisk: any,
): TokenSecurityData {
  const tokenSecurityData: TokenSecurityData = {
    chain: 'sol',
    token_address: token.token_address,
    is_burn: auditRisk.lpBurned ? 1 : 0,
    is_mintable: auditRisk.mintDisabled ? 0 : 1,
    is_blacklisted: auditRisk.freezeDisabled ? 0 : 1,
    updated_at: new Date(),
  };

  return tokenSecurityData;
}

// Interface for TokenSecurityData
interface TokenSecurityData {
  chain: string;
  token_address: string;
  is_burn: number | null;
  is_mintable: number | null;
  is_blacklisted: number | null;
  updated_at: Date;
}

// Function to update the TokenSecurity in the database
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
        is_burn: securityData.is_burn,
        is_mintable: securityData.is_mintable,
        is_blacklisted: securityData.is_blacklisted,
        updated_at: securityData.updated_at,
      },
      update: {
        is_burn: securityData.is_burn,
        is_mintable: securityData.is_mintable,
        is_blacklisted: securityData.is_blacklisted,
        updated_at: securityData.updated_at,
      },
    });

    console.log(
      `Token security data for ${securityData.token_address} updated successfully.`,
    );
  } catch (error) {
    console.error(
      `Error updating token security data for ${securityData.token_address}:`,
      error,
    );
    throw error;
  }
}

export default updateSolSecurity;
