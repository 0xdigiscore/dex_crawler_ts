import { PrismaClient, GmgnSignal } from '@prisma/client';
import { GmgnSignalData } from './types.js';

const prisma = new PrismaClient();

export async function storeSignals(
  signals: GmgnSignalData[],
): Promise<GmgnSignal[]> {
  return await prisma.$transaction(async (tx) => {
    const storedSignals: GmgnSignal[] = [];

    for (const signal of signals) {
      // 检查信号是否已存在
      const existingSignal = await tx.gmgnSignal.findUnique({
        where: { id: signal.id },
      });

      if (existingSignal) {
        // 如果信号已存在，跳过此信号
        console.log(`Signal with id ${signal.id} already exists. Skipping.`);
        storedSignals.push(existingSignal);
        continue;
      }

      // 检查并创建 Token（如果不存在）
      await tx.token.upsert({
        where: {
          chain_token_address: {
            chain: signal.token?.chain,
            token_address: signal.token_address,
          },
        },
        update: {}, // 如果存在，不更新任何字段
        create: {
          chain: signal.token?.chain,
          token_address: signal.token_address,
          symbol: signal.token?.symbol,
          name: signal.token?.name,
          logo: signal.token?.logo,
          decimals: signal.token?.decimals,
          total_supply: signal.token?.total_supply,
          website: signal.token?.website,
          telegram: signal.token?.telegram,
          twitter_username: signal.token?.twitter_username,
          is_open_source: signal.token?.is_open_source,
          renounced: signal.token?.renounced,
          pool_creation_timestamp: signal.token?.pool_creation_timestamp,
          is_honeypot: signal.token?.is_honeypot,
          buy_tax: signal.token?.buy_tax,
          sell_tax: signal.token?.sell_tax,
        },
      });

      // 创建新的 GmgnSignal
      const createdSignal = await tx.gmgnSignal.create({
        data: {
          id: signal.id, // 使用传入的 id
          timestamp: BigInt(signal.timestamp),
          maker: signal.maker,
          token_address: signal.token_address,
          chain: signal.token?.chain,
          token_price: signal.token_price,
          from_timestamp: BigInt(signal.from_timestamp),
          updated_at: BigInt(signal.updated_at),
          buy_duration: signal.buy_duration,
          buy_usd: signal.buy_usd,
          tx_count: signal.tx_count,
          signal_type: signal.signal_type,
          smart_buy: signal.smart_buy,
          smart_sell: signal.smart_sell,
          signal_1h_count: signal.signal_1h_count,
          first_entry_price: signal.first_entry_price,
          price_change: signal.price_change,
          link: signal.link!.toString(),
          recent_buys: signal.recent_buys!.toString(),
          is_first: signal.is_first,
          // 处理 previous_signals 关系
          previous_signals: {
            connect: signal.previous_signals.map((ps) => ({ id: ps.id })),
          },
        },
      });

      storedSignals.push(createdSignal);
    }

    return storedSignals;
  });
}
