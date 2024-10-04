import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { parseAndSaveWallets } from "@/models/walletModel.js";

// Define interfaces for the API response
interface ApiResponse {
  code: number;
  msg: string;
  data: WalletData;
}

interface WalletData {
  twitter_bind: boolean;
  twitter_fans_num: number;
  twitter_username: string | null;
  twitter_name: string | null;
  ens: string | null;
  avatar: string | null;
  name: string | null;
  eth_balance: string;
  sol_balance: string;
  trx_balance: string;
  balance: string;
  total_value: number;
  unrealized_profit: number;
  unrealized_pnl: number;
  realized_profit: number;
  pnl: number;
  pnl_7d: number;
  pnl_30d: number;
  realized_profit_7d: number;
  realized_profit_30d: number;
  winrate: number;
  all_pnl: number;
  total_profit: number;
  total_profit_pnl: number;
  buy_30d: number;
  sell_30d: number;
  buy_7d: number;
  sell_7d: number;
  buy: number;
  sell: number;
  history_bought_cost: number;
  token_avg_cost: number;
  token_sold_avg_profit: number;
  token_num: number;
  profit_num: number;
  pnl_lt_minus_dot5_num: number;
  pnl_minus_dot5_0x_num: number;
  pnl_lt_2x_num: number;
  pnl_2x_5x_num: number;
  pnl_gt_5x_num: number;
  last_active_timestamp: number;
  tags: string[];
  tag_rank: Record<string, number>;
  followers_count: number;
  is_contract: boolean;
  updated_at: number;
  refresh_requested_at: number | null;
}

export async function smartEthWalletNew({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing ETH Smart Wallets: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse: ApiResponse = await (response as Response).json();
    const { data } = jsonResponse;

    // Filter out wallets with unwanted tags
    const unwantedTags = ["sandwich_bot", "scammer", "snipe_bot"];
    if (data.tags && data.tags.some((tag) => unwantedTags.includes(tag))) {
      log.info(`Skipping wallet with unwanted tags: ${data.tags.join(", ")}`);
      return;
    }

    console.log(`smart new wallets request url: ${request.url}`);

    await parseAndSaveWallets([data], "eth", "1step", log, request.url);
  } else {
    log.error(`Failed to fetch response from: ${request.url}`);
  }
}
