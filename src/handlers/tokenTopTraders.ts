import { CrawlingContext } from "crawlee";
import { Response } from "playwright";
import { PrismaClient } from "@prisma/client";
import { URL } from "url";

const prisma = new PrismaClient();

export async function topTokenTraders({
  request,
  log,
  response,
}: CrawlingContext) {
  log.info(`Processing Token Top Traders: ${request.url}`);
  if (response && (response as Response).ok()) {
    const jsonResponse = await (response as Response).json();

    // Extract the data array from the response
    const { code, msg, data } = jsonResponse;

    if (code === 0 && Array.isArray(data)) {
      // Extract chain and tokenAddress from the request URL
      const { chain, tokenAddress } = extractTokenInfoFromRequest(request.url);

      // Update or create the Token
      await prisma.token.upsert({
        where: { chain_token_address: { chain, token_address: tokenAddress } },
        update: {}, // Update token fields if necessary
        create: {
          chain,
          token_address: tokenAddress,
        },
      });

      // Process top traders
      for (const topTraderData of data) {
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
            eth_balance: topTraderData.eth_balance?.toString(),
            sol_balance: topTraderData.sol_balance?.toString(),
            trx_balance: topTraderData.trx_balance?.toString(),
            balance: topTraderData.balance?.toString(),
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
            eth_balance: topTraderData.eth_balance?.toString(),
            sol_balance: topTraderData.sol_balance?.toString(),
            trx_balance: topTraderData.trx_balance?.toString(),
            balance: topTraderData.balance?.toString(),
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

      log.info(
        `Processed ${data.length} top traders for token ${tokenAddress} on ${chain}`
      );
    } else {
      log.error(`Failed to process response: ${msg}`);
    }
  }
}

// Updated extractTokenInfoFromRequest function
function extractTokenInfoFromRequest(url: string): {
  chain: string;
  tokenAddress: string;
} {
  const parsedUrl = new URL(url);
  const pathnameParts = parsedUrl.pathname.split("/").filter(Boolean);

  // Adjust indices based on your actual URL structure
  const len = pathnameParts.length;
  const chain = pathnameParts[len - 2];
  const tokenAddress = pathnameParts[len - 1];

  return { chain, tokenAddress };
}
