import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { firefox } from 'playwright';
import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';

interface Token {
  chain: string;
  token_address: string;
  created_at: Date;
}

interface TokenSecurityData {
  address: string;
  is_show_alert: boolean;
  is_open_source: boolean;
  open_source: number;
  is_blacklist: boolean;
  blacklist: number;
  is_honeypot: number | null;
  honeypot: number;
  is_renounced: boolean;
  renounced: number;
  can_sell: number;
  can_not_sell: number;
  buy_tax: string;
  sell_tax: string;
  average_tax: string;
  high_tax: string;
  flags: any[];
  lock_info: Array<{
    NFT_list: any | null;
    address: string;
    balance: string;
    is_locked: number;
    locked_detail: any | null;
    percent: string;
    tag?: string;
  }>;
  top_10_holder_rate: string;
  lock_summary: {
    is_locked: boolean;
    lock_detail: Array<{
      percent: string;
      pool: string;
      is_blackhole: boolean;
    }>;
    lock_tags: string[];
    lock_percent: string;
    left_lock_percent: string;
  };
}

const TOKEN_CHAIN = 'eth';

async function updateTokenSecurity(): Promise<void> {
  try {
    // 从数据库中获取所有 Token，按最新插入时间排序
    const tokens: Token[] = await prisma.token.findMany({
      where: { chain: 'eth' },
      orderBy: { created_at: 'desc' },
      select: {
        chain: true,
        token_address: true,
        created_at: true,
      },
    });

    // 构建请求列表
    const requests = tokens.map((token) => {
      return {
        url: `https://gmgn.ai/api/v1/token_security_evm/${TOKEN_CHAIN}/${token.token_address}`,
        userData: { token },
      };
    });

    // const proxyConfiguration = new ProxyConfiguration({
    //   proxyUrls: [process.env.PROXY_URL_ADDRESS],
    // });

    // 初始化 PlaywrightCrawler
    const crawler = new PlaywrightCrawler({
      //proxyConfiguration,
      requestHandlerTimeoutSecs: 30, // 根据需要调整超时时间
      maxConcurrency: 6, // 设置合适的并发数
      launchContext: {
        launcher: firefox,
        launchOptions: {
          headless: true,
        },
      },
      requestHandler: async ({ request, page, log }) => {
        const { token } = request.userData as { token: Token };
        try {
          // 使用 page.request 发起 API 请求
          await page.goto(request.url);
          const jsonData = await page.evaluate(() =>
            JSON.parse(document.body.innerText),
          );

          if (jsonData.code === 0) {
            const data: TokenSecurityData = jsonData.data;
            await parseAndSaveTokenSecurity(data);
            log.info(`Token ${data.address} 的安全数据已更新。`);
          } else {
            log.error(
              `获取 Token ${token.token_address} 安全数据失败：${jsonData.message}`,
            );
          }
        } catch (error) {
          log.error(`处理 Token ${token.token_address} 时出错：${error}`);
        }
      },
    });

    // 开始爬取
    await crawler.run(requests);
    console.log('所有 Token 安全数据更新完成。');
  } catch (error) {
    console.error('更新 Token 安全数据任务时出错：', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 定义 parseAndSaveTokenSecurity 函数
async function parseAndSaveTokenSecurity(data: TokenSecurityData) {
  try {
    // 更新 Token 的安全信息
    await prisma.token.update({
      where: {
        chain_token_address: {
          chain: TOKEN_CHAIN,
          token_address: data.address,
        },
      },
      data: {
        is_show_alert: data.is_show_alert,
        is_open_source: data.is_open_source,
        is_honeypot: data.is_honeypot === 1,
        renounced: data.is_renounced ? 1 : 0,
        buy_tax: data.buy_tax,
        sell_tax: data.sell_tax,
        //@ts-ignore
        average_tax: data.average_tax,
        //high_tax: data.high_tax,
        lockInfo: data.lock_info,
        //@ts-ignore
        honeypot: data.honeypot,
        //@ts-ignore
        top_10_holder_rate: data.top_10_holder_rate,
        //lock_summary: data.lock_summary,
      },
    });

    console.log(`Token ${data.address} 的安全数据已更新。`);
  } catch (error) {
    console.error('更新 Token 安全数据时出错:', error);
    throw error;
  }
}

export default updateTokenSecurity;
