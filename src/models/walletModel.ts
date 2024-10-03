import prisma from "@/database/prisma.js"; // 确保正确导入 Prisma 客户端

export async function parseAndSaveWallets(
  walletsData: any[],
  chain: string,
  log: any
) {
  for (const wallet of walletsData) {
    try {
      await prisma.smartWallet.upsert({
        where: {
          smartWalletChainWalletAddressUnique: {
            chain: chain,
            wallet_address: wallet.wallet_address,
          },
        },
        update: {
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
        create: {
          chain: chain,
          wallet_address: wallet.wallet_address,
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

      log.info(`Successfully processed wallet: ${wallet.wallet_address}`);
    } catch (error) {
      console.log(`error parsing wallet: ${JSON.stringify(wallet)}`);
      console.log(`error: ${error}`);
      log.error(
        `Error processing wallet: ${wallet.wallet_address}`,
        error ?? "Unknown error"
      );
    }
  }
}
