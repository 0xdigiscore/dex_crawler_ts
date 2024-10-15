import prisma from '@dex_crawler/gmgn_crawler/src/database/prisma.js';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 定义限速器，每分钟最多 60 个请求
const limiter = new Bottleneck({
  reservoir: 60, // 初始可用令牌数
  reservoirRefreshAmount: 60, // 每次刷新添加的令牌数
  reservoirRefreshInterval: 60000, // 刷新间隔，60秒（1分钟）
  maxConcurrent: 3, // 最大并发数为 10
});

interface TokenSecurityData {
  anti_whale_modifiable: string;
  buy_tax: string;
  can_take_back_ownership: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  external_call: string;
  hidden_owner: string;

  honeypot_with_same_creator: string;
  is_anti_whale: string;
  is_blacklisted: string;
  is_honeypot: string;
  is_in_dex: string;
  is_mintable: string;
  is_open_source: string;
  is_proxy: string;
  is_whitelisted: string;
  lp_holder_count: string;
  lp_total_supply: string;
  owner_address: string;
  owner_balance: string;
  owner_change_balance: string;
  owner_percent: string;
  personal_slippage_modifiable: string;
  selfdestruct: string;
  sell_tax: string;
  slippage_modifiable: string;
  token_name: string;
  token_symbol: string;
  total_supply: string;
  trading_cooldown: string;
  transfer_pausable: string;
  is_airdrop_scam?: string | null; // Optional
  is_true_token?: string | null; // Optional
  note?: string | null; // Optional
  other_potential_risks?: string | null; // Optional
  trust_list?: string | null; // Optional
  holder_count?: number | null; // Optional
  lockInfo?: number | null; // Optional
  top_10_holder_rate?: number | null; // Optional
  holders?: any[] | null; // Optional
  lp_holders?: any[] | null; // Optional
}

const httpsAgent = new HttpsProxyAgent(process.env.PROXY_URL);

/**
 * 获取 TokenSecurity 数据
 * @param tokenAddress 代币地址
 * @returns TokenSecurityData 或 null
 */
async function fetchTokenSecurity(
  tokenAddress: string,
): Promise<TokenSecurityData | null> {
  try {
    const response = await axios.get<{
      code: number;
      message: string;
      result: {
        [address: string]: TokenSecurityData;
      };
    }>(`https://api.gopluslabs.io/api/v1/token_security/1`, {
      params: {
        contract_addresses: tokenAddress,
      },
      httpsAgent,
    });

    if (response.data.code !== 1) {
      console.error(
        `获取 TokenSecurity 数据失败，地址: ${tokenAddress}, 信息: ${response.data.message}`,
      );
      return null;
    }

    const securityData = response.data.result[tokenAddress.toLowerCase()];
    if (!securityData) {
      console.error(`未找到 TokenSecurity 数据，地址: ${tokenAddress}`);
      return null;
    }

    return securityData;
  } catch (error) {
    console.error(`获取 TokenSecurity ${tokenAddress} 时出错:`, error);
    return null;
  }
}

/**
 * 更新 TokenSecurity 数据
 */
async function updateTokenSecurity(): Promise<void> {
  try {
    const tokens = await prisma.token.findMany({
      where: { chain: 'eth' },
      select: { chain: true, token_address: true },
      orderBy: { created_at: 'desc' },
    });

    const tasks = tokens.map((token) =>
      limiter.schedule(async () => {
        const securityData = await fetchTokenSecurity(token.token_address);
        if (securityData) {
          // 计算 lockInfo（锁仓流动性占比）
          let lockInfoPercentage = 0;
          try {
            const lpHolders = securityData.lp_holders || [];
            const lockedLpBalances = lpHolders
              .filter((holder) => holder.is_locked === 1)
              .map((holder) => parseFloat(holder.balance));
            const totalLockedLpBalance = lockedLpBalances.reduce(
              (sum, balance) => sum + balance,
              0,
            );
            const lpTotalSupply = parseFloat(
              securityData.lp_total_supply || '0',
            );
            if (lpTotalSupply > 0) {
              lockInfoPercentage = (totalLockedLpBalance / lpTotalSupply) * 100;
            }
          } catch (error) {
            console.error(
              `计算 lockInfo 时出错，地址: ${token.token_address}`,
              error,
            );
          }

          // 计算 top_10_holder_rate（除去标签为 UniswapV2 的前 10 持仓占比之和）
          let top10HolderRate = 0;
          try {
            const holders = securityData.holders || [];
            let filteredHolders = holders.filter(
              (holder) => holder.tag !== 'UniswapV2',
            );
            filteredHolders = holders.filter(
              (holder) => holder.tag !== 'UniswapV3',
            );
            const sortedHolders = filteredHolders.sort(
              (a, b) => parseFloat(b.balance) - parseFloat(a.balance),
            );
            const top10Holders = sortedHolders.slice(0, 10);
            const top10Percentages = top10Holders.map((holder) =>
              parseFloat(holder.percent),
            );
            top10HolderRate = top10Percentages.reduce(
              (sum, percent) => sum + percent,
              0,
            );
          } catch (error) {
            console.error(
              `计算 top_10_holder_rate 时出错，地址: ${token.token_address}`,
              error,
            );
          }

          // 更新数据库
          await prisma.tokenSecurity.upsert({
            where: {
              chain_token_address: {
                chain: token.chain,
                token_address: token.token_address,
              },
            },
            update: {
              anti_whale_modifiable: Number(securityData.anti_whale_modifiable),
              buy_tax: securityData.buy_tax,
              can_take_back_ownership: Number(
                securityData.can_take_back_ownership,
              ),
              cannot_buy: Number(securityData.cannot_buy),
              cannot_sell_all: Number(securityData.cannot_sell_all),
              creator_address: securityData.creator_address,
              creator_balance: securityData.creator_balance,
              creator_percent: securityData.creator_percent,
              external_call: securityData.external_call,
              hidden_owner: Number(securityData.hidden_owner),
              honeypot_with_same_creator: Number(
                securityData.honeypot_with_same_creator,
              ),
              is_airdrop_scam: Number(securityData.is_airdrop_scam),
              is_anti_whale: Number(securityData.is_anti_whale),
              is_blacklisted: Number(securityData.is_blacklisted),
              is_honeypot: Number(securityData.is_honeypot),
              is_in_dex: Number(securityData.is_in_dex),
              is_mintable: Number(securityData.is_mintable),
              is_open_source: Number(securityData.is_open_source),
              is_proxy: Number(securityData.is_proxy),
              is_whitelisted: Number(securityData.is_whitelisted),
              lp_holder_count: Number(securityData.lp_holder_count),
              lp_total_supply: securityData.lp_total_supply,
              note: securityData.note,
              other_potential_risks: securityData.other_potential_risks,
              owner_address: securityData.owner_address,
              owner_balance: securityData.owner_balance,
              owner_change_balance: securityData.owner_change_balance,
              owner_percent: securityData.owner_percent,
              personal_slippage_modifiable:
                securityData.personal_slippage_modifiable,
              selfdestruct: securityData.selfdestruct,
              sell_tax: securityData.sell_tax,
              slippage_modifiable: securityData.slippage_modifiable,
              token_name: securityData.token_name,
              token_symbol: securityData.token_symbol,
              total_supply: securityData.total_supply,
              trading_cooldown: securityData.trading_cooldown,

              transfer_pausable: Number(securityData.transfer_pausable),

              is_true_token: Number(securityData.is_true_token),
              trust_list: securityData.trust_list,
              // @ts-ignore
              holder_count: securityData.holder_count,
              lock_info_rate: lockInfoPercentage,
              top_10_holder_rate: top10HolderRate,
              updated_at: new Date(),
            },
            create: {
              chain: token.chain,
              token_address: token.token_address,
              anti_whale_modifiable: Number(securityData.anti_whale_modifiable),
              buy_tax: securityData.buy_tax,
              can_take_back_ownership: Number(
                securityData.can_take_back_ownership,
              ),
              cannot_buy: Number(securityData.cannot_buy),
              cannot_sell_all: Number(securityData.cannot_sell_all),
              creator_address: securityData.creator_address,
              creator_balance: securityData.creator_balance,
              creator_percent: securityData.creator_percent,
              external_call: securityData.external_call,
              hidden_owner: Number(securityData.hidden_owner),
              honeypot_with_same_creator: Number(
                securityData.honeypot_with_same_creator,
              ),
              is_airdrop_scam: Number(securityData.is_airdrop_scam),
              is_anti_whale: Number(securityData.is_anti_whale),
              is_blacklisted: Number(securityData.is_blacklisted),
              is_honeypot: Number(securityData.is_honeypot),
              is_in_dex: Number(securityData.is_in_dex),
              is_mintable: Number(securityData.is_mintable),
              is_open_source: Number(securityData.is_open_source),
              is_proxy: Number(securityData.is_proxy),
              is_whitelisted: Number(securityData.is_whitelisted),
              lp_holder_count: Number(securityData.lp_holder_count),
              lp_total_supply: securityData.lp_total_supply,
              note: securityData.note,
              other_potential_risks: securityData.other_potential_risks,
              owner_address: securityData.owner_address,
              owner_balance: securityData.owner_balance,
              owner_change_balance: securityData.owner_change_balance,
              owner_percent: securityData.owner_percent,
              personal_slippage_modifiable:
                securityData.personal_slippage_modifiable,
              selfdestruct: securityData.selfdestruct,
              sell_tax: securityData.sell_tax,
              slippage_modifiable: securityData.slippage_modifiable,
              token_name: securityData.token_name,
              token_symbol: securityData.token_symbol,
              total_supply: securityData.total_supply,
              trading_cooldown: securityData.trading_cooldown,
              transfer_pausable: Number(securityData.transfer_pausable),
              is_true_token: Number(securityData.is_true_token),
              trust_list: securityData.trust_list,
              // @ts-ignore
              holder_count: securityData.holder_count,
              lock_info_rate: lockInfoPercentage,
              top_10_holder_rate: top10HolderRate,
              updated_at: new Date(),
            },
          });

          console.log(
            `已为 Token ${token.token_address} 更新 TokenSecurity 记录。`,
          );
        }
      }),
    );

    await Promise.all(tasks);
    console.log('所有 TokenSecurity 数据均已更新。');
  } catch (error) {
    console.error('更新 TokenSecurity 时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default updateTokenSecurity;
