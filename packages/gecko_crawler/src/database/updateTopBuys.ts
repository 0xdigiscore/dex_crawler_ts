import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import { Token, HolderData } from '@/types/interfaces.js';

export async function updateTopBuysInDatabase(token: Token, data: HolderData) {
  try {
    //@ts-ignore
    await prisma.topBuys.upsert({
      where: {
        topBuysCompositeUnique: {
          chain: token.chain,
          token_address: token.token_address,
        },
      },
      update: {
        holder_count_70: data.holder_count,
        hold: data.statusNow.hold ?? 0,
        bought_more: data.statusNow.bought_more ?? 0,
        sold_part: data.statusNow.sold_part ?? 0,
        sold: data.statusNow.sold ?? 0,
        transferred: data.statusNow.transfered ?? 0,
        bought_rate: data.statusNow.bought_rate,
        holding_rate: data.statusNow.holding_rate,
        smart_pos: data.statusNow.smart_pos,
        smart_count_hold: data.statusNow.smart_count_hold,
        smart_count_bought_more: data.statusNow.smart_count_bought_more,
        smart_count_sold_part: data.statusNow.smart_count_sold_part,
        smart_count_sold: data.statusNow.smart_count_sold,
        smart_count_transferred: data.statusNow.smart_count_transfered,
        top_10_holder_rate: data.statusNow.top_10_holder_rate,
      },
      create: {
        chain: token.chain,
        token_address: token.token_address,
        holder_count_70: data.holder_count,
        hold: data.statusNow.hold,
        bought_more: data.statusNow.bought_more,
        sold_part: data.statusNow.sold_part,
        sold: data.statusNow.sold,
        transferred: data.statusNow.transfered,
        bought_rate: data.statusNow.bought_rate,
        holding_rate: data.statusNow.holding_rate,
        smart_pos: data.statusNow.smart_pos,
        smart_count_hold: data.statusNow.smart_count_hold,
        smart_count_bought_more: data.statusNow.smart_count_bought_more,
        smart_count_sold_part: data.statusNow.smart_count_sold_part,
        smart_count_sold: data.statusNow.smart_count_sold,
        smart_count_transferred: data.statusNow.smart_count_transfered,
        top_10_holder_rate: data.statusNow.top_10_holder_rate,
      },
    });

    console.log(
      `Token ${token.token_address} top buys updated in the database.`,
    );
  } catch (error) {
    console.error('Error updating top buys in the database:', error);
    throw error;
  }
}
