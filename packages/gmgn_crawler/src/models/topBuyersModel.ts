import prisma from '@/database/prisma.js';

interface TopBuyerData {
  chain: string;
  token_address: string;
  wallet_address: string;
  wallet_tag?: string;
}

export async function upsertTopBuyer(
  chain: string,
  tokenAddress: string,
  topBuyerData: TopBuyerData,
) {
  const now = new Date();

  const existingRecord = await prisma.topBuyswallet.findUnique({
    where: {
      topBuysCompositeUnique: {
        chain,
        token_address: tokenAddress,
        // w: topBuyerData.wallet_address,
      },
    },
  });

  // 如果记录已存在，直接返回，不进行任何操作
  if (existingRecord) {
    return;
  }
  await prisma..create({
    data: {
      chain: chain,
      token_address: tokenAddress,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

export async function upsertTopBuyers(
  chain: string,
  tokenAddress: string,
  topBuyersData: TopBuyerData[],
) {
  for (const buyerData of topBuyersData) {
    await upsertTopBuyer(chain, tokenAddress, buyerData);
  }
}
