import prisma from "@/database/prisma.js";

interface TopTraderData {
  address: string;
  realized_profit: number;
  unrealized_profit: number;
  profit: number;
  profit_change: number;
  buy_amount: number;
  buy_amount_cur: number;
  sell_amount: number;
  sell_amount_cur: number;
  buy_tx_count_total: number;
  buy_tx_count_cur: number;
  sell_tx_count_total: number;
  sell_tx_count_cur: number;
  last_active_timestamp: number;
  addr_type: number;
  amount_cur: number;
  usd_value: number;
  cost_cur: number;
  sell_amount_percentage: number;
  sell_volume_cur: number;
  buy_volume_cur: number;
  netflow_usd: number;
  netflow_amount: number;
  wallet_tag_v2: string;
  eth_balance?: string;
  sol_balance?: string;
  trx_balance?: string;
  balance?: string;
  amount_percentage: number;
  unrealized_pnl: number;
  avg_cost: number;
  avg_sold: number;
  accu_amount: number;
  accu_cost: number;
  cost: number;
  total_cost: number;
  name: string;
  avatar: string;
  twitter_username: string;
  twitter_name: string;
  tags?: string[];
  maker_token_tags?: string[];
  tag_rank: number;
}

export async function upsertTopTrader(
  chain: string,
  tokenAddress: string,
  topTraderData: TopTraderData
) {
  await prisma.topTrader.upsert({
    where: {
      topTraderCompositeUnique: {
        chain: chain,
        token_address: tokenAddress,
        wallet_address: topTraderData.address,
      },
    },
    update: {
      realized_profit: topTraderData.realized_profit,
      unrealized_profit: topTraderData.unrealized_profit,
      profit: topTraderData.profit,
      profit_change: topTraderData.profit_change,
      buy_amount: topTraderData.buy_amount,
      buy_amount_cur: topTraderData.buy_amount_cur,
      sell_amount: topTraderData.sell_amount,
      sell_amount_cur: topTraderData.sell_amount_cur,
      buy_tx_count: topTraderData.buy_tx_count_total,
      buy_tx_count_cur: topTraderData.buy_tx_count_cur,
      sell_tx_count: topTraderData.sell_tx_count_total,
      sell_tx_count_cur: topTraderData.sell_tx_count_cur,
      last_trade_at: new Date(topTraderData.last_active_timestamp * 1000),
      addr_type: topTraderData.addr_type,
      amount_cur: topTraderData.amount_cur,
      usd_value: topTraderData.usd_value,
      cost_cur: topTraderData.cost_cur,
      sell_amount_percentage: topTraderData.sell_amount_percentage,
      sell_volume_cur: topTraderData.sell_volume_cur,
      buy_volume_cur: topTraderData.buy_volume_cur,
      netflow_usd: topTraderData.netflow_usd,
      netflow_amount: topTraderData.netflow_amount,
      wallet_tag_v2: topTraderData.wallet_tag_v2,
      eth_balance: topTraderData.eth_balance,
      sol_balance: topTraderData.sol_balance,
      trx_balance: topTraderData.trx_balance,
      balance: topTraderData.balance,
      amount_percentage: topTraderData.amount_percentage,
      unrealized_pnl: topTraderData.unrealized_pnl,
      avg_cost: topTraderData.avg_cost,
      avg_sold: topTraderData.avg_sold,
      accu_amount: topTraderData.accu_amount,
      accu_cost: topTraderData.accu_cost,
      cost: topTraderData.cost,
      total_cost: topTraderData.total_cost,
      name: topTraderData.name,
      avatar: topTraderData.avatar,
      twitter_username: topTraderData.twitter_username,
      twitter_name: topTraderData.twitter_name,
      tags: topTraderData.tags || [],
      maker_token_tags: topTraderData.maker_token_tags || [],
      tag_rank: topTraderData.tag_rank,
      updated_at: new Date(),
    },
    create: {
      chain: chain,
      token_address: tokenAddress,
      wallet_address: topTraderData.address,
      realized_profit: topTraderData.realized_profit,
      unrealized_profit: topTraderData.unrealized_profit,
      profit: topTraderData.profit,
      profit_change: topTraderData.profit_change,
      buy_amount: topTraderData.buy_amount,
      buy_amount_cur: topTraderData.buy_amount_cur,
      sell_amount: topTraderData.sell_amount,
      sell_amount_cur: topTraderData.sell_amount_cur,
      buy_tx_count: topTraderData.buy_tx_count_total,
      buy_tx_count_cur: topTraderData.buy_tx_count_cur,
      sell_tx_count: topTraderData.sell_tx_count_total,
      sell_tx_count_cur: topTraderData.sell_tx_count_cur,
      last_trade_at: new Date(topTraderData.last_active_timestamp * 1000),
      addr_type: topTraderData.addr_type,
      amount_cur: topTraderData.amount_cur,
      usd_value: topTraderData.usd_value,
      cost_cur: topTraderData.cost_cur,
      sell_amount_percentage: topTraderData.sell_amount_percentage,
      sell_volume_cur: topTraderData.sell_volume_cur,
      buy_volume_cur: topTraderData.buy_volume_cur,
      netflow_usd: topTraderData.netflow_usd,
      netflow_amount: topTraderData.netflow_amount,
      wallet_tag_v2: topTraderData.wallet_tag_v2,
      eth_balance: topTraderData.eth_balance,
      sol_balance: topTraderData.sol_balance,
      trx_balance: topTraderData.trx_balance,
      balance: topTraderData.balance,
      amount_percentage: topTraderData.amount_percentage,
      unrealized_pnl: topTraderData.unrealized_pnl,
      avg_cost: topTraderData.avg_cost,
      avg_sold: topTraderData.avg_sold,
      accu_amount: topTraderData.accu_amount,
      accu_cost: topTraderData.accu_cost,
      cost: topTraderData.cost,
      total_cost: topTraderData.total_cost,
      name: topTraderData.name,
      avatar: topTraderData.avatar,
      twitter_username: topTraderData.twitter_username,
      twitter_name: topTraderData.twitter_name,
      tags: topTraderData.tags || [],
      maker_token_tags: topTraderData.maker_token_tags || [],
      tag_rank: topTraderData.tag_rank,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

export async function upsertTopTraders(
  chain: string,
  tokenAddress: string,
  topTradersData: TopTraderData[]
) {
  for (const traderData of topTradersData) {
    await upsertTopTrader(chain, tokenAddress, traderData);
  }
}
