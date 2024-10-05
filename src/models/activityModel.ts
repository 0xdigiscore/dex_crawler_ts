import prisma from "@/database/prisma.js";

export interface WalletActivityData {
  chain: string;
  tx_hash: string;
  timestamp: number;
  event_type: string;
  token_address: string;
  token: any;
  token_amount: string;
  quote_amount: string;
  cost_usd: number;
  buy_cost_usd: number;
  price: number;
  price_usd: number;
  is_open_or_close: number;
  quote_address: string;
  quote_token: any;
  from_address: string | null;
  from_is_contract: boolean | null;
  to_address: string | null;
  to_is_contract: boolean | null;
  balance: string;
  sell_30d: number;
  last_active_timestamp: number;
}

export async function parseAndSaveWalletActivities(
  activities: WalletActivityData[],
  log: any,
  walletAddress: string
) {
  for (const activity of activities) {
    try {
      await prisma.walletActivity.upsert({
        where: {
          walletActivityChainTxHashUnique: {
            chain: activity.chain,
            wallet_address: walletAddress,
            tx_hash: activity.tx_hash,
          },
        },
        update: {
          chain: activity.chain,
          wallet_address: walletAddress,
          tx_hash: activity.tx_hash,
          timestamp: activity.timestamp,
          event_type: activity.event_type,
          token_address: activity.token_address,
          token: activity.token,
          token_amount: activity.token_amount,
          quote_amount: activity.quote_amount,
          cost_usd: activity.cost_usd,
          buy_cost_usd: activity.buy_cost_usd,
          price: activity.price,
          price_usd: activity.price_usd,
          is_open_or_close: activity.is_open_or_close,
          quote_address: activity.quote_address,
          quote_token: activity.quote_token,
          from_address: activity.from_address,
          from_is_contract: activity.from_is_contract,
          to_address: activity.to_address,
          to_is_contract: activity.to_is_contract,
          balance: activity.balance,
          sell_30d: activity.sell_30d,
          last_active_timestamp: activity.last_active_timestamp,
        },
        create: {
          chain: activity.chain,
          wallet_address: walletAddress,
          tx_hash: activity.tx_hash,
          timestamp: activity.timestamp,
          event_type: activity.event_type,
          token_address: activity.token_address,
          token: activity.token,
          token_amount: activity.token_amount,
          quote_amount: activity.quote_amount,
          cost_usd: activity.cost_usd,
          buy_cost_usd: activity.buy_cost_usd,
          price: activity.price,
          price_usd: activity.price_usd,
          is_open_or_close: activity.is_open_or_close,
          quote_address: activity.quote_address,
          quote_token: activity.quote_token,
          from_address: activity.from_address,
          from_is_contract: activity.from_is_contract,
          to_address: activity.to_address,
          to_is_contract: activity.to_is_contract,
          balance: activity.balance,
          sell_30d: activity.sell_30d,
          last_active_timestamp: activity.last_active_timestamp,
        },
      });
      log.info(`Saved wallet activity: ${walletAddress} ${activity.tx_hash}`);
    } catch (error) {
      log.error(
        `Error saving wallet activity: ${walletAddress} ${activity.tx_hash}`,
        error
      );
      log.error(error);
    }
  }
}
