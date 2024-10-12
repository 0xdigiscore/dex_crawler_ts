import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import { TokenSecurityData } from '@/types/interfaces.js';
import { TOKEN_CHAIN } from '@/helper/constants.js';

export async function updateTokenSecurityDataInDatabase(
  data: TokenSecurityData,
) {
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
