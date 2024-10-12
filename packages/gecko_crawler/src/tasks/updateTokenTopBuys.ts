import { PlaywrightCrawler } from 'crawlee';
import { firefox } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';

interface Token {
  chain: string;
  token_address: string;
}

interface HolderData {
  chain: string;
  holder_count: number;
  statusNow: {
    hold: number;
    bought_more: number;
    sold_part: number;
    sold: number;
    transfered: number;
    bought_rate: string;
    holding_rate: string;
    smart_pos: number[];
    smart_count_hold: number | null;
    smart_count_bought_more: number | null;
    smart_count_sold_part: number | null;
    smart_count_sold: number | null;
    smart_count_transfered: number | null;
    top_10_holder_rate: number;
  };
}

const TOKEN_CHAIN = 'eth';

async function updateTokenTopBuys(): Promise<void> {
  try {
    // Fetch the latest tokens
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
      url: `https://gmgn.ai/defi/quotation/v1/tokens/top_buyers/${TOKEN_CHAIN}/${token.token_address}`,
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
          // Fetch token stats
          await page.goto(request.url);
          const topBuysJson = await page.evaluate(() =>
            JSON.parse(document.body.innerText),
          );

          if (topBuysJson.code === 0) {
            const holderData: HolderData = topBuysJson.data.holders;
            await updateTopBuysInDatabase(token, holderData);
            log.info(`Token ${token.token_address} top buys updated.`);
          } else {
            log.error(
              `Failed to fetch top buys for token ${token.token_address}: ${topBuysJson.msg}`,
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

async function updateTopBuysInDatabase(token: Token, data: HolderData) {
  try {
    //@ts-ignore
    await prisma.topBuys.upsert({
      where: {
        topBuysCompositeUnique: {
          chain: token.chain,
          token_address: token.token_address,
        },
      },
      update: {
        holder_count_70: data.holder_count,
        hold: data.statusNow.hold ?? 0,
        bought_more: data.statusNow.bought_more ?? 0,
        sold_part: data.statusNow.sold_part ?? 0,
        sold: data.statusNow.sold ?? 0,
        transferred: data.statusNow.transfered ?? 0,
        bought_rate: data.statusNow.bought_rate,
        holding_rate: data.statusNow.holding_rate,
        smart_pos: data.statusNow.smart_pos,
        smart_count_hold: data.statusNow.smart_count_hold,
        smart_count_bought_more: data.statusNow.smart_count_bought_more,
        smart_count_sold_part: data.statusNow.smart_count_sold_part,
        smart_count_sold: data.statusNow.smart_count_sold,
        smart_count_transferred: data.statusNow.smart_count_transfered,
        top_10_holder_rate: data.statusNow.top_10_holder_rate,
      },
      create: {
        chain: token.chain,
        token_address: token.token_address,
        holder_count_70: data.holder_count,
        hold: data.statusNow.hold,
        bought_more: data.statusNow.bought_more,
        sold_part: data.statusNow.sold_part,
        sold: data.statusNow.sold,
        transferred: data.statusNow.transfered,
        bought_rate: data.statusNow.bought_rate,
        holding_rate: data.statusNow.holding_rate,
        smart_pos: data.statusNow.smart_pos,
        smart_count_hold: data.statusNow.smart_count_hold,
        smart_count_bought_more: data.statusNow.smart_count_bought_more,
        smart_count_sold_part: data.statusNow.smart_count_sold_part,
        smart_count_sold: data.statusNow.smart_count_sold,
        smart_count_transferred: data.statusNow.smart_count_transfered,
        top_10_holder_rate: data.statusNow.top_10_holder_rate,
      },
    });

    console.log(
      `Token ${token.token_address} top buys updated in the database.`,
    );
  } catch (error) {
    console.error('Error updating top buys in the database:', error);
    throw error;
  }
}

updateTokenTopBuys();
