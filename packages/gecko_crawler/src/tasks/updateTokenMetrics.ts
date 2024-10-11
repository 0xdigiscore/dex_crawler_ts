import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import axios, { AxiosError } from 'axios';
import Bottleneck from 'bottleneck';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 定义限速器，每分钟最多 30 个请求
const limiter = new Bottleneck({
  reservoir: 60, // 初始可用令牌数
  reservoirRefreshAmount: 60, // 每次刷新添加的令牌数
  reservoirRefreshInterval: 60000, // 刷新间隔，60秒（1分钟）
  maxConcurrent: 10, // 最大并发数为 30
});

interface TokenMetrics {
  holderCount: number;
  price: number | null;
  marketCap: number | null;
  volume_24h: number | null;
}

async function fetchTokenMetrics(
  tokenAddress: string,
): Promise<TokenMetrics | null> {
  try {
    // 获取 holder_count
    const holdersResponse = await axios.get<{
      items: Array<{
        token: {
          holders: string;
          exchange_rate: string;
          circulating_market_cap: string;
          volume_24h: string;
        };
      }>;
    }>(`https://eth.blockscout.com/api/v2/tokens/${tokenAddress}/holders`);
    const holderCount =
      Number(holdersResponse.data.items[0]?.token?.holders) || 0;

    console.log(`holderCount: ${holderCount}`);

    let price: number | null = null;
    let marketCap: number | null = null;
    let volume_24h: number | null = null;
    const httpsAgent = new HttpsProxyAgent(process.env.PROXY_URL);

    try {
      const geckoResponse = await axios.get<{
        data: {
          attributes: {
            price_usd: string;
            market_cap_usd: string;
            volume_usd: { h24: string };
            fdv_usd: string;
          };
        };
      }>(
        `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${tokenAddress}`,
        {
          httpsAgent,
        },
      );
      const tokenData = geckoResponse.data.data.attributes;
      price = parseFloat(tokenData.price_usd);
      marketCap =
        tokenData.market_cap_usd !== null
          ? parseFloat(tokenData.market_cap_usd)
          : parseFloat(tokenData.fdv_usd);
      volume_24h = parseFloat(tokenData.volume_usd.h24);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          `GeckoTerminal API request failed for token ${tokenAddress}. Using Blockscout data.`,
        );
        const tokenData = holdersResponse.data.items[0]?.token;
        price = tokenData?.exchange_rate
          ? parseFloat(tokenData.exchange_rate)
          : null;
        marketCap = tokenData?.circulating_market_cap
          ? parseFloat(tokenData.circulating_market_cap)
          : null;
        volume_24h = tokenData?.volume_24h
          ? parseFloat(tokenData.volume_24h)
          : null;
      } else {
        throw error;
      }
    }

    return {
      holderCount,
      price,
      marketCap,
      volume_24h,
    };
  } catch (error) {
    console.error(`获取 Token ${tokenAddress} 指标时出错:`, error);
    return null;
  }
}

async function updateTokenMetrics(): Promise<void> {
  try {
    const now = new Date();
    const tokens = await prisma.token.findMany({
      where: { chain: 'eth' },
      select: { chain: true, token_address: true },
      orderBy: { created_at: 'desc' },
    });

    const tasks = tokens.map((token) =>
      limiter.schedule(async () => {
        const metrics = await fetchTokenMetrics(token.token_address);
        if (metrics !== null) {
          let dataToInsert: any = {
            chain: token.chain,
            token_address: token.token_address,
            timestamp: now,
            holder_count: metrics.holderCount,
            price: metrics.price,
            market_cap: metrics.marketCap,
            volume_24h: metrics.volume_24h,
          };

          if (metrics.price === null) {
            const latestRecord = await prisma.tokenMetrics.findFirst({
              where: {
                chain: token.chain,
                token_address: token.token_address,
              },
              orderBy: { timestamp: 'desc' },
            });

            if (latestRecord) {
              dataToInsert.price = latestRecord.price;
              dataToInsert.market_cap = latestRecord.market_cap;
              dataToInsert.volume_24h = latestRecord.volume_24h;
              dataToInsert.holder_count = metrics.holderCount;
            }
          }

          await prisma.tokenMetrics.create({ data: dataToInsert });

          console.log(
            `已为 Token ${
              token.token_address
            } 插入新的 TokenMetrics 记录，时间：${now.toISOString()}`,
          );
        }
      }),
    );

    await Promise.all(tasks);
    console.log('所有 TokenMetrics 都已更新。');
  } catch (error) {
    console.error('更新 TokenMetrics 时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default updateTokenMetrics;
