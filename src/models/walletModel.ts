import prisma from "@/database/prisma.js";

export interface WalletData {
  wallet_address?: string;
  address?: string;
  realized_profit: number;
  buy: number;
  sell: number;
  last_active: number;
  realized_profit_1d: number;
  realized_profit_7d: number;
  realized_profit_30d: number;
  pnl_30d: number;
  pnl_7d: number;
  pnl_1d: number;
  txs_30d: number;
  buy_30d: number;
  sell_30d: number;
  balance: number;
  eth_balance: number;
  sol_balance: number;
  trx_balance: number;
  twitter_username: string | null;
  avatar: string | null;
  ens: string | null;
  tag: string | null;
  tag_rank: Record<string, number>;
  nickname: string | null;
  tags: string[];
  maker_avatar_color: string | null;
  twitter_name: string | null;
  followers_count: number;
  is_blue_verified: boolean | number;
  twitter_description: string | null;
  name: string | null;
  avg_hold_time: number;
  recent_buy_tokens: any[];
  winrate_7d: number;
  avg_cost_7d: number;
  pnl_lt_minus_dot5_num_7d: number;
  pnl_minus_dot5_0x_num_7d: number;
  pnl_lt_2x_num_7d: number;
  pnl_2x_5x_num_7d: number;
  pnl_gt_5x_num_7d: number;
  daily_profit_7d: Array<{ timestamp: number; profit: number }>;
  txs: number;
}

export async function parseAndSaveWallets(
  walletsData: WalletData[],
  chain: string,
  source: string,
  log: any,
  request_url?: string
) {
  for (const wallet of walletsData) {
    let wallet_address = wallet.wallet_address || wallet.address || "";
    if (!wallet_address && request_url) {
      wallet_address = extractWalletAddressFromUrl(request_url);
    }
    log.info(`wallet_address: ${wallet_address} request_url: ${request_url}`);
    if (!wallet_address) {
      console.log(`wallet_address is empty`);
      continue;
    }

    try {
      await prisma.smartWallet.upsert({
        where: {
          smartWalletChainWalletAddressUnique: {
            chain,
            wallet_address,
          },
        },
        update: {
          realized_profit: wallet.realized_profit,
          source,
          buy: wallet.buy,
          sell: wallet.sell,
          last_active: wallet.last_active,
          realized_profit_1d: wallet.realized_profit_1d,
          realized_profit_7d: wallet.realized_profit_7d,
          realized_profit_30d: wallet.realized_profit_30d,
          pnl_30d: wallet.pnl_30d,
          pnl_7d: wallet.pnl_7d,
          pnl_1d: wallet.pnl_1d,
          txs_30d: wallet.txs_30d,
          buy_30d: wallet.buy_30d,
          sell_30d: wallet.sell_30d,
          eth_balance: wallet.eth_balance?.toString(),
          sol_balance: wallet.sol_balance?.toString(),
          trx_balance: wallet.trx_balance?.toString(),
          balance: wallet.balance?.toString(),
          twitter_username: wallet.twitter_username,
          avatar: wallet.avatar,
          ens: wallet.ens,
          tag_rank: wallet.tag_rank,
          tags: wallet.tags,
          maker_avatar_color: wallet.maker_avatar_color,
          twitter_name: wallet.twitter_name,
          followers_count: wallet.followers_count,
          is_blue_verified:
            typeof wallet.is_blue_verified === "boolean"
              ? wallet.is_blue_verified
              : wallet.is_blue_verified === 1,
          twitter_description: wallet.twitter_description,
          avg_hold_time: wallet.avg_hold_time,
          winrate_7d: wallet.winrate_7d,
          avg_cost_7d: wallet.avg_cost_7d,
          pnl_lt_minus_dot5_num_7d: wallet.pnl_lt_minus_dot5_num_7d,
          pnl_minus_dot5_0x_num_7d: wallet.pnl_minus_dot5_0x_num_7d,
          pnl_lt_2x_num_7d: wallet.pnl_lt_2x_num_7d,
          pnl_2x_5x_num_7d: wallet.pnl_2x_5x_num_7d,
          pnl_gt_5x_num_7d: wallet.pnl_gt_5x_num_7d,
          daily_profit_7d: wallet.daily_profit_7d,
          txs: wallet.txs,
        },
        create: {
          chain,
          source,
          wallet_address,
          realized_profit: wallet.realized_profit,
          buy: wallet.buy,
          sell: wallet.sell,
          last_active: wallet.last_active,
          realized_profit_1d: wallet.realized_profit_1d,
          realized_profit_7d: wallet.realized_profit_7d,
          realized_profit_30d: wallet.realized_profit_30d,
          pnl_30d: wallet.pnl_30d,
          pnl_7d: wallet.pnl_7d,
          pnl_1d: wallet.pnl_1d,
          txs_30d: wallet.txs_30d,
          buy_30d: wallet.buy_30d,
          sell_30d: wallet.sell_30d,
          eth_balance: wallet.eth_balance?.toString(),
          sol_balance: wallet.sol_balance?.toString(),
          trx_balance: wallet.trx_balance?.toString(),
          balance: wallet.balance?.toString(),
          twitter_username: wallet.twitter_username,
          avatar: wallet.avatar,
          ens: wallet.ens,
          tag_rank: wallet.tag_rank,
          tags: wallet.tags,
          maker_avatar_color: wallet.maker_avatar_color,
          twitter_name: wallet.twitter_name,
          followers_count: wallet.followers_count,
          is_blue_verified:
            typeof wallet.is_blue_verified === "boolean"
              ? wallet.is_blue_verified
              : wallet.is_blue_verified === 1,
          twitter_description: wallet.twitter_description,
          avg_hold_time: wallet.avg_hold_time,
          winrate_7d: wallet.winrate_7d,
          avg_cost_7d: wallet.avg_cost_7d,
          pnl_lt_minus_dot5_num_7d: wallet.pnl_lt_minus_dot5_num_7d,
          pnl_minus_dot5_0x_num_7d: wallet.pnl_minus_dot5_0x_num_7d,
          pnl_lt_2x_num_7d: wallet.pnl_lt_2x_num_7d,
          pnl_2x_5x_num_7d: wallet.pnl_2x_5x_num_7d,
          pnl_gt_5x_num_7d: wallet.pnl_gt_5x_num_7d,
          daily_profit_7d: wallet.daily_profit_7d,
          txs: wallet.txs,
        },
      });

      log.info(`Successfully processed wallet: ${wallet_address}`);
    } catch (error) {
      console.log(`error parsing wallet: ${JSON.stringify(wallet)}`);
      console.log(`error: ${error}`);
      log.error(
        `Error processing wallet: ${wallet_address}`,
        error ?? "Unknown error"
      );
    }
  }
}

function extractWalletAddressFromUrl(url: string): string {
  const match = url.match(/\/walletNew\/([^?]+)/);
  return match ? match[1] : "";
}
