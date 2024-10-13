import prisma from '@/database/prisma.js';

async function parseAndSaveHotTokens(data: any[]) {
  try {
    const now = new Date(new Date().toUTCString());
    const hourTimestamp = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
      ),
    );
    // Add this line to get the current timestamp in seconds
    const currentTimestampInSeconds = Math.floor(now.getTime() / 1000);

    for (const token of data) {
      if (token.is_honeypot === 1 || token.is_show_alert) {
        console.log(
          `Skipping token ${token.address} because it is a honeypot or show alert`,
        );
        break;
      }

      await prisma.$transaction(async (tx) => {
        // 1. Upsert the Token first to satisfy the foreign key constraint
        await tx.token.upsert({
          where: {
            chain_token_address: {
              chain: token.chain,
              token_address: token.address,
            },
          },
          update: {
            symbol: token.symbol,
            logo: token.logo,

            is_honeypot: token.is_honeypot === 1,
            is_open_source: token.is_open_source === 1,
            //@ts-ignore
            is_show_alert: token.is_show_alert,
            cto_flag: token.cto_flag,
            creator_close: token.creator_close,
            creator_token_status: token.creator_token_status,
            hot_level: token.hot_level,
            call_number: token.call_number,

            renounced: token.renounced,
            twitter_username: token.twitter_username,
            website: token.website,
            telegram: token.telegram,
            buy_tax: token.buy_tax,
            sell_tax: token.sell_tax,
            pool_creation_timestamp: token.pool_creation_timestamp,
            deploy_time: token.open_timestamp,
            //@ts-ignore
            lockInfo: token.lockInfo,
          },
          create: {
            chain: token.chain,
            token_address: token.address,
            symbol: token.symbol,
            logo: token.logo,
            is_honeypot: token.is_honeypot === 1,
            is_open_source: token.is_open_source === 1,
            //@ts-ignore
            is_show_alert: token.is_show_alert,
            cto_flag: token.cto_flag,
            creator_close: token.creator_close,
            creator_token_status: token.creator_token_status,
            hot_level: token.hot_level,
            call_number: token.call_number,
            deploy_time: token.open_timestamp,

            renounced: token.renounced,
            twitter_username: token.twitter_username,
            website: token.website,
            telegram: token.telegram,
            buy_tax: token.buy_tax,
            sell_tax: token.sell_tax,
            pool_creation_timestamp: token.pool_creation_timestamp,
            //@ts-ignore
            lockInfo: token.lockInfo,
          },
        });
        // 2. Create TokenMetrics
        // @ts-ignore
        await tx.tokenMetrics.create({
          data: {
            chain: token.chain,
            token_address: token.address,
            timestamp: BigInt(currentTimestampInSeconds),
            price: token.price,
            market_cap: token.market_cap,
            liquidity: token.liquidity,
            volume_24h: token.volume,
            holder_count: token.holder_count,
            swaps: token.swaps,
            buys: token.buys,
            sells: token.sells,
            price_change_percent: token.price_change_percent,
            price_change_percent1h: token.price_change_percent1h,
            price_change_percent1m: token.price_change_percent1m,
            price_change_percent5m: token.price_change_percent5m,
            smart_buy_24h: token.smart_buy_24h,
            smart_sell_24h: token.smart_sell_24h,
          },
        });

        // 2. Handle the HotToken after ensuring the Token exists
        const existingHotToken = await tx.hotToken.findFirst({
          where: {
            chain: token.chain,
            token_address: token.address,
            hour_timestamp: hourTimestamp,
          },
        });

        if (existingHotToken) {
          // If HotToken exists, update it
          await tx.hotToken.update({
            where: { id: existingHotToken.id },
            data: {
              chain: token.chain,
              token_address: token.address,
              hour_timestamp: hourTimestamp,
            },
          });
        } else {
          // If HotToken does not exist, create it
          await tx.hotToken.create({
            data: {
              chain: token.chain,
              token_address: token.address,
              hour_timestamp: hourTimestamp,
            },
          });
        }
      });
    }

    console.log(
      'Tokens and HotTokens have been successfully parsed and saved to the database.',
    );
  } catch (error) {
    console.error('Error parsing and saving tokens:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { parseAndSaveHotTokens };
