export const generateWalletUrl = (address) => {
  return `https://gmgn.ai/defi/quotation/v1/smartmoney/eth/walletNew/${address}?period=7d`;
};

export const generateTopTradersUrl = (address) => {
  return `https://gmgn.ai/defi/quotation/v1/tokens/top_traders/eth/${address}?orderby=profit&direction=desc`;
};

export const generateWalletActivityUrl = (walletAddress, chain) => {
  return `https://gmgn.ai/defi/quotation/v1/wallet_activity/${chain}?type=buy&type=sell&wallet=${walletAddress}&limit=10&cost=10`;
};

export const generateTopBuyersUrl = (address, chain) => {
  return `https://gmgn.ai/defi/quotation/v1/tokens/top_buyers/${chain}/${address}`;
};
