import prisma from '@/database/prisma.js';

interface TopBuyerData {
  chain: string;
  token_address: string;
  wallet_address: string;
  wallet_tag?: string;
}

export async function upsertTopBuyer(
  chain: string,
  topBuyerData: TopBuyerData,
) {
  const existingRecord = await prisma.topBuysWallet.findUnique({
    where: {
      topBuysWalletCompositeUnique: {
        chain,
        token_address: topBuyerData.token_address,
        wallet_address: topBuyerData.wallet_address,
      },
    },
  });

  if (existingRecord) {
    return;
  }
  const tokenExist = await prisma.token.findUnique({
    where: {
      chain_token_address: {
        chain,
        token_address: topBuyerData.token_address,
      },
    },
  });
  if (!tokenExist) {
    await prisma.token.create({
      data: {
        chain: chain,
        token_address: topBuyerData.token_address,
      },
    });
  }
  const re = await prisma.topBuysWallet.create({
    data: {
      chain: chain,
      token_address: topBuyerData.token_address,
      wallet_address: topBuyerData.wallet_address,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log('re', re, topBuyerData);
}

export async function upsertTopBuyers(
  chain: string,
  topBuyersData: TopBuyerData[],
) {
  for (const buyerData of topBuyersData) {
    await upsertTopBuyer(chain, buyerData);
  }
}
