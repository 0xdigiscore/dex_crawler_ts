import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TokenData {
  chain: string;
  address: string;
  symbol: string;
  logo: string;
  is_honeypot: number;
  is_open_source: number;
  renounced: number;
  twitter_username: string;
  website: string;
  telegram: string;
  buy_tax: number;
  sell_tax: number;
  pool_creation_timestamp: number;
}

interface HotTokenData extends TokenData {
  price: number;
  price_change_percent: number;
  price_change_percent1m: number;
  price_change_percent5m: number;
  price_change_percent1h: number;
  swaps: number;
  volume: number;
  liquidity: number;
  market_cap: number;
  hot_level: number;
  call_number: number;
  smart_buy_24h: number;
  smart_sell_24h: number;
  open_timestamp: number;
  holder_count: number;
  is_show_alert: boolean;
  buys: number;
  sells: number;
  lockInfo: object;
  creator_token_status: string;
  creator_close: boolean;
  rat_trader_amount_rate: number;
  cto_flag: number;
}

async function parseAndSaveTokens(response: any) {
  try {
    const tokens: HotTokenData[] = response.data.rank;

    for (const token of tokens) {
      await prisma.$transaction(async (tx) => {
        // Update or create Token
        const upsertedToken = await tx.token.upsert({
          where: {
            chain_token_address: {
              chain: token.chain,
              token_address: token.address,
            },
          },
          update: {
            symbol: token.symbol,
            logo: token.logo,
            is_honeypot: Boolean(token.is_honeypot),
            is_open_source: Boolean(token.is_open_source),
            renounced: Boolean(token.renounced),
            twitter_username: token.twitter_username,
            website: token.website,
            telegram: token.telegram,
            buy_tax: token.buy_tax,
            sell_tax: token.sell_tax,
            pool_creation_timestamp: token.pool_creation_timestamp,
          },
          create: {
            chain: token.chain,
            token_address: token.address,
            symbol: token.symbol,
            logo: token.logo,
            is_honeypot: Boolean(token.is_honeypot),
            is_open_source: Boolean(token.is_open_source),
            renounced: Boolean(token.renounced),
            twitter_username: token.twitter_username,
            website: token.website,
            telegram: token.telegram,
            buy_tax: token.buy_tax,
            sell_tax: token.sell_tax,
            pool_creation_timestamp: token.pool_creation_timestamp,
          },
        });

        // Update or create HotToken
        await tx.hotToken.upsert({
          where: {
            chain_token_address: {
              chain: token.chain,
              token_address: token.address,
            },
          },
          update: {
            price: token.price,
            price_change_percent: token.price_change_percent,
            price_change_percent1h: token.price_change_percent1h,
            price_change_percent1m: token.price_change_percent1m,
            price_change_percent5m: token.price_change_percent5m,
            swaps: token.swaps,
            volume: token.volume,
            liquidity: token.liquidity,
            market_cap: token.market_cap,
            hot_level: token.hot_level,
            call_number: token.call_number,
            smart_buy_24h: token.smart_buy_24h,
            smart_sell_24h: token.smart_sell_24h,
            open_timestamp: token.open_timestamp,
            holder_count: token.holder_count,
            is_show_alert: token.is_show_alert,
            buys: token.buys,
            sells: token.sells,
            lockInfo: token.lockInfo,
            creator_token_status: token.creator_token_status,
            creator_close: token.creator_close,
            rat_trader_amount_rate: token.rat_trader_amount_rate,
            cto_flag: token.cto_flag,
          },
          create: {
            chain: token.chain,
            token_address: token.address,
            price: token.price,
            price_change_percent: token.price_change_percent,
            price_change_percent1h: token.price_change_percent1h,
            price_change_percent1m: token.price_change_percent1m,
            price_change_percent5m: token.price_change_percent5m,
            swaps: token.swaps,
            volume: token.volume,
            liquidity: token.liquidity,
            market_cap: token.market_cap,
            hot_level: token.hot_level,
            call_number: token.call_number,
            smart_buy_24h: token.smart_buy_24h,
            smart_sell_24h: token.smart_sell_24h,
            open_timestamp: token.open_timestamp,
            holder_count: token.holder_count,
            is_show_alert: token.is_show_alert,
            buys: token.buys,
            sells: token.sells,
            lockInfo: token.lockInfo,
            creator_token_status: token.creator_token_status,
            creator_close: token.creator_close,
            rat_trader_amount_rate: token.rat_trader_amount_rate,
            cto_flag: token.cto_flag,
          },
        });
      });
    }

    console.log(
      "Tokens and HotTokens have been successfully parsed and saved to the database."
    );
  } catch (error) {
    console.error("Error parsing and saving tokens:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { parseAndSaveTokens, TokenData, HotTokenData };