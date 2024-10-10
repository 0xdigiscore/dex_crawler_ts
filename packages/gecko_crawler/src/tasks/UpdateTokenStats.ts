import { PlaywrightCrawler } from 'crawlee';
import { firefox } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';

interface Token {
  chain: string;
  token_address: string;
}

interface TokenStatsData {
  signal_count: number;
  degen_call_count: number;
  rat_trader_count: number;
  top_rat_trader_count: number;
  top_smart_degen_count: number;
  top_fresh_wallet_count: number;
  top_rat_trader_amount_percentage: number;
  top_trader_rat_trader_count: number;
  top_trader_rat_trader_amount_percentage: number;
  top_trader_smart_degen_count: number;
  top_trader_fresh_wallet_count: number;
  bluechip_owner_count: number;
  bluechip_owner_percentage: number;
}

const TOKEN_CHAIN = 'eth';

async function updateTokenStats(): Promise<void> {
  try {
    // Fetch the latest 100 tokens
    const tokens: Token[] = await prisma.token.findMany({
      where: { chain: TOKEN_CHAIN },
      orderBy: { created_at: 'desc' },
      select: {
        chain: true,
        token_address: true,
      },
    });

    // Build request list
    const requests = tokens.map((token) => ({
      url: `https://gmgn.ai/defi/quotation/v1/tokens/stats/${TOKEN_CHAIN}/${token.token_address}`,
      userData: { token },
    }));

    // Initialize PlaywrightCrawler
    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 30,
      maxConcurrency: 6,
      launchContext: {
        launcher: firefox,
        launchOptions: {
          headless: true,
        },
      },
      requestHandler: async ({ request, page, log }) => {
        const { token } = request.userData as { token: Token };
        try {
          await page.goto(request.url);
          const jsonData = await page.evaluate(() =>
            JSON.parse(document.body.innerText),
          );

          if (jsonData.code === 0) {
            const data: TokenStatsData = jsonData.data;
            await updateTokenStatsInDatabase(token, data);
            log.info(`Token ${token.token_address} stats updated.`);
          } else {
            log.error(
              `Failed to fetch stats for token ${token.token_address}: ${jsonData.msg}`,
            );
          }
        } catch (error) {
          log.error(`Error processing token ${token.token_address}: ${error}`);
        }
      },
    });

    // Start crawling
    await crawler.run(requests);
    console.log('All token stats updated.');
  } catch (error) {
    console.error('Error updating token stats:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateTokenStatsInDatabase(token: Token, data: TokenStatsData) {
  try {
    await prisma.token.update({
      where: {
        chain_token_address: {
          chain: token.chain,
          token_address: token.token_address,
        },
      },
      data: {
        top_rat_trader_count: data.top_rat_trader_count,
        signal_count: data.signal_count,
        degen_call_count: data.degen_call_count,
        top_rat_trader_amount_percentage: data.top_rat_trader_amount_percentage,
        top_smart_degen_count: data.top_smart_degen_count,
        top_fresh_wallet_count: data.top_fresh_wallet_count,
        top_trader_smart_degen_count: data.top_trader_smart_degen_count,
        top_trader_fresh_wallet_count: data.top_trader_fresh_wallet_count,
        bluechip_owner_count: data.bluechip_owner_count,
        bluechip_owner_percentage: data.bluechip_owner_percentage,
      },
    });

    console.log(`Token ${token.token_address} stats updated in the database.`);
  } catch (error) {
    console.error('Error updating token stats in the database:', error);
    throw error;
  }
}

updateTokenStats();
