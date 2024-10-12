import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import { Token, TokenStatsData } from '@/types/interfaces.js';

export async function updateTokenStatsInDatabase(
  token: Token,
  data: TokenStatsData,
) {
  try {
    await prisma.token.update({
      where: {
        chain_token_address: {
          chain: token.chain,
          token_address: token.token_address,
        },
      },
      data: {
        top_rat_trader_count: data.top_rat_trader_count,
        signal_count: data.signal_count,
        degen_call_count: data.degen_call_count,
        top_rat_trader_amount_percentage: data.top_rat_trader_amount_percentage,
        top_smart_degen_count: data.top_smart_degen_count,
        top_fresh_wallet_count: data.top_fresh_wallet_count,
        top_trader_smart_degen_count: data.top_trader_smart_degen_count,
        top_trader_fresh_wallet_count: data.top_trader_fresh_wallet_count,
        bluechip_owner_count: data.bluechip_owner_count,
        bluechip_owner_percentage: data.bluechip_owner_percentage,
      },
    });

    console.log(`Token ${token.token_address} stats updated in the database.`);
  } catch (error) {
    console.error('Error updating token stats in the database:', error);
    throw error;
  }
}
