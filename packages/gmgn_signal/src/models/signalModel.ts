import { PrismaClient, GmgnSignal } from '@prisma/client';
import { GmgnSignalData } from './types.js';

const prisma = new PrismaClient();

export async function storeSignals(
  signals: GmgnSignalData[],
): Promise<GmgnSignal[]> {
  try {
    return await prisma.$transaction(async (tx) => {
      const storedSignals: GmgnSignal[] = [];

      for (const signal of signals) {
        try {
          // Check if tx is defined
          if (!tx || typeof tx.gmgnSignal?.findUnique !== 'function') {
            console.error('Transaction object is invalid:', tx);
            throw new Error('Invalid transaction object');
          }

          // 检查信号是否已存在
          const existingSignal = await tx.gmgnSignal.findUnique({
            where: { id: signal.id },
          });

          if (existingSignal) {
            // 如果信号已存在，跳过此信号
            console.log(
              `Signal with id ${signal.id} already exists. Skipping.`,
            );
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
              is_open_source: signal.token?.is_open_source === 1,
              renounced: signal.token?.renounced,
              pool_creation_timestamp: signal.token?.pool_creation_timestamp,
              is_honeypot: signal.token?.is_honeypot === 1,
              buy_tax: signal.token?.buy_tax,
              sell_tax: signal.token?.sell_tax,
            },
          });
          const now = new Date(new Date().toUTCString());
          await tx.tokenMetrics.create({
            data: {
              chain: signal.token?.chain,
              token_address: signal.token.address,
              timestamp: now,
              price: signal.token.price,
              market_cap: Number(signal.token.market_cap),
              liquidity: Number(signal.token.liquidity),
              volume_24h: Number(signal.token.volume),
              holder_count: signal.token.holder_count,
              swaps: signal.token.swaps,
              buys: signal.token.buys,
              sells: signal.token.sells,
              price_change_percent: signal.token.price_change_percent,
              price_change_percent1h: signal.token.price_change_percent1h,
            },
          });

          // 检查 previous_signals 是否存在
          let previousSignalsConnect = [];
          if (signal.previous_signals && signal.previous_signals.length > 0) {
            const existingPreviousSignals = await tx.gmgnSignal.findMany({
              where: {
                id: {
                  in: signal.previous_signals.map((ps) => ps.id),
                },
              },
              select: { id: true },
            });

            previousSignalsConnect = existingPreviousSignals.map((ps) => ({
              id: ps.id,
            }));
          }

          // 创建新的 GmgnSignal
          const createdSignal = await tx.gmgnSignal.create({
            data: {
              id: signal.id, // 使用传入的 id
              timestamp: BigInt(signal.timestamp),
              maker: signal.maker,
              token_address: signal.token_address,
              //@ts-ignore
              token_symbol: signal.token?.symbol,
              chain: signal.token?.chain,
              token_price: signal.token_price,
              from_timestamp: signal.from_timestamp,
              updated_at: signal.updated_at,
              buy_duration: signal.buy_duration,
              buy_usd: signal.buy_usd,
              tx_count: signal.tx_count,
              signal_type: signal.signal_type,
              smart_buy: signal.smart_buy,
              smart_sell: signal.smart_sell,
              signal_1h_count: signal.signal_1h_count,
              first_entry_price: signal.first_entry_price,
              price_change: signal.price_change,
              link: signal.link,
              recent_buys: signal.recent_buys,
              is_first: signal.is_first,
              // 只连接存在的 previous_signals
              previous_signals: {
                connect: previousSignalsConnect,
              },
            },
          });

          storedSignals.push(createdSignal);
        } catch (error) {
          console.error(`Error processing signal ${signal.id}:`, error);
          // Optionally, you can choose to continue with the next signal
          // or throw the error to stop the entire process
          throw error;
        }
      }

      return storedSignals;
    });
  } catch (error) {
    console.error('Error in storeSignals:', error);
    throw error;
  }
}
