import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveWallets, WalletData } from "@/models/walletModel.js";

export async function smartEthWalletNew({
  request,
  log,
  response,
}: CrawlingContext) {
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();
    const { data } = jsonResponse;

    // Convert API response to WalletData format
    let walletData: WalletData = {
      wallet_address: data.address,
      realized_profit: data.realized_profit,
      buy: data.buy,
      sell: data.sell,
      last_active: data.last_active_timestamp,
      realized_profit_1d: 0, // Not provided in API response
      realized_profit_7d: data.realized_profit_7d,
      realized_profit_30d: data.realized_profit_30d,
      pnl_30d: data.pnl_30d,
      pnl_7d: data.pnl_7d,
      pnl_1d: 0, // Not provided in API response
      txs_30d: 0, // Not provided in API response
      buy_30d: data.buy_30d,
      sell_30d: data.sell_30d,
      balance: parseFloat(data.balance),
      eth_balance: parseFloat(data.eth_balance),
      sol_balance: parseFloat(data.sol_balance),
      trx_balance: parseFloat(data.trx_balance),
      twitter_username: data.twitter_username,
      avatar: data.avatar,
      ens: data.ens,
      tag: null, // Not provided in API response
      tag_rank: data.tag_rank,
      nickname: null, // Not provided in API response
      tags: data.tags,
      maker_avatar_color: null, // Not provided in API response
      twitter_name: data.twitter_name,
      followers_count: data.followers_count,
      is_blue_verified: false, // Not provided in API response
      twitter_description: null, // Not provided in API response
      name: data.name,
      avg_hold_time: 0, // Not provided in API response
      recent_buy_tokens: [], // Not provided in API response
      winrate_7d: data.winrate,
      avg_cost_7d: data.token_avg_cost,
      pnl_lt_minus_dot5_num_7d: data.pnl_lt_minus_dot5_num ?? 0,
      pnl_minus_dot5_0x_num_7d: data.pnl_minus_dot5_0x_num ?? 0,
      pnl_lt_2x_num_7d: data.pnl_lt_2x_num ?? 0,
      pnl_2x_5x_num_7d: data.pnl_2x_5x_num ?? 0,
      pnl_gt_5x_num_7d: data.pnl_gt_5x_num ?? 0,
      daily_profit_7d: [], // Not provided in API response
      txs: 0, // Not provided in API response
    };
    log.warning(`walletData.tag: ${JSON.stringify(walletData.tags)}`);

    // Filter out wallets with unwanted tags
    const unwantedTags = ["sandwich_bot", "scammer", "snipe_bot"];
    if (
      walletData &&
      walletData.tags.some((tag) => unwantedTags.includes(tag))
    ) {
      log.info(`Skipping wallet with unwanted tags: ${data.tags.join(", ")}`);
      return;
    }

    await parseAndSaveWallets([walletData], "eth", "1step", log, request.url);
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
