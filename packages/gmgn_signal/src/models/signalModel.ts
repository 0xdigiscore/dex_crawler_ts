import { PrismaClient, GmgnSignal } from '@prisma/client';
import { GmgnSignalData } from './types.js';

const prisma = new PrismaClient();

export async function storeSignals(
  signals: GmgnSignalData[],
): Promise<GmgnSignal[]> {
  const storedSignals: GmgnSignal[] = [];

  for (const signal of signals) {
    try {
      const storedSignal = await prisma.$transaction(
        async (tx) => {
          // Check if tx is defined
          if (!tx || typeof tx.gmgnSignal?.findUnique !== 'function') {
            throw new Error('Invalid transaction object');
          }

          // 检查信号是否已存在
          const existingSignal = await tx.gmgnSignal.findUnique({
            //@ts-ignore
            where: { signal_id: signal.id },
          });

          if (existingSignal) {
            console.log(
              `Signal with signal_id ${signal.id} already exists. Skipping.`,
            );
            return existingSignal;
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
          // Add this line to get the current timestamp in seconds
          const currentTimestampInSeconds = Math.floor(now.getTime() / 1000);

          await tx.tokenMetrics.upsert({
            where: {
              chain_token_address_timestamp: {
                chain: signal.token?.chain,
                token_address: signal.token.address,
                timestamp: currentTimestampInSeconds,
              },
            },
            update: {}, // If it exists, don't update anything
            create: {
              chain: signal.token?.chain,
              token_address: signal.token.address,
              timestamp: currentTimestampInSeconds,
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

          // 定义时间窗口（15分钟前）
          const fifteenMinutesAgo = BigInt(
            Math.floor(Date.now() / 1000) - 15 * 60,
          );

          // 检查在过去15分钟内是否已经存在相同的信号
          const existingSameTypeSignal = await tx.gmgnSignal.findFirst({
            where: {
              source: 'gmgn_web',
              chain: signal.token?.chain,
              token_address: signal.token_address,
              signal_type: signal.signal_type,
              timestamp: {
                gte: fifteenMinutesAgo,
              },
            },
          });

          if (existingSameTypeSignal) {
            console.log(
              `在过去15分钟内已存在相同的信号（source: gmgn_web, chain: ${signal.token?.chain}, token_address: ${signal.token_address}, signal_type: ${signal.signal_type}）。跳过该信号。`,
            );
            return existingSameTypeSignal;
          }

          // 创建新的 GmgnSignal
          return await tx.gmgnSignal.upsert({
            where: {
              //@ts-ignore
              gmgnSignalUnique: {
                source: 'gmgn_web',
                chain: signal.token?.chain,
                token_address: signal.token_address,
                signal_type: signal.signal_type,
                timestamp: safeTimestampToBigInt(signal.timestamp),
              },
            },
            update: {
              // 如果记录已存在且在15分钟内，更新 occurrence_count 和 last_occurrence
              //@ts-ignore
              occurrence_count: {
                increment: 1,
              },
              last_occurrence: now,
            },
            create: {
              //@ts-ignore
              signal_id: signal.id, // 使用传入的 id
              source: 'gmgn_web',
              timestamp: safeTimestampToBigInt(signal.timestamp),
              maker: signal.maker,
              token_address: signal.token_address,
              //@ts-ignore
              token_symbol: signal.token?.symbol,
              chain: signal.token?.chain,
              token_price: signal.token_price,
              from_timestamp: signal.from_timestamp,
              //@ts-ignore
              updated_at: signal.updated_at
                ? new Date(signal.updated_at * 1000)
                : undefined,
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
              occurrence_count: 1, // Add this line to set the initial occurrence count
              last_occurrence: new Date(), // Add this line to set the initial last occurrence
            },
          });
        },
        {
          maxWait: 5000, // 5 seconds
          timeout: 10000, // 10 seconds
        },
      );

      storedSignals.push(storedSignal);
    } catch (error) {
      console.error(`Error processing signal ${signal.id}:`, error);
      // Continue with the next signal instead of throwing
    }
  }

  return storedSignals;
}

function safeTimestampToBigInt(timestamp: number | string): bigint {
  // 如果是字符串，先转换为数字
  const numTimestamp =
    typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;

  // 创建一个 Date 对象，并将其转换为 UTC 时间
  const utcDate = new Date(numTimestamp * 1000);
  const utcTimestamp = utcDate.getTime() / 1000;

  // 直接取整，然后转换为 BigInt
  return BigInt(Math.floor(utcTimestamp));
}
