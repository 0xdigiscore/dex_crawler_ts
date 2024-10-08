// packages/gmgn_crawler/src/models/types.ts

interface TokenData {
  chain: string;
  address: string;
  symbol: string;
  logo: string;
  is_honeypot: number;
  is_open_source: number;
  renounced: number;
  twitter_username: string;
  website: string;
  telegram: string;
  buy_tax: number;
  sell_tax: number;
  price: number;
  pool_creation_timestamp: number;
  decimals: number;
  total_supply: number;
  name: string;
  market_cap: string;
  liquidity: string;
  volume: string;
  holder_count: number;
  swaps: number;
  buys: number;
  sells: number;
  price_change_percent: number;
  price_change_percent1h: number;
}

export interface LinkData {
  twitter_username?: string;
  website?: string;
  telegram?: string;
}

export interface RecentBuysData {
  smart_wallets: number;
  smart_buy_usd: number;
  following_wallets: number;
  following_buy_usd: number;
  buy_timestamp: number;
  buy_list: any[]; // 根据实际数据结构定义
}

export interface PreviousSignal {
  id: number;
  timestamp: number;
  maker?: string;
  token_address: string;
  token_price: number;
  from_timestamp: number;
  updated_at: number;
  buy_duration: number;
  buy_usd: number;
  tx_count: number;
  signal_type: string;
  // 其他相关字段...
}

export interface GmgnSignalData {
  id: number;
  timestamp: number;
  maker?: string;
  token_address: string;
  token_price: number;
  from_timestamp: number;
  updated_at: number;
  buy_duration: number;
  buy_usd: number;
  tx_count: number;
  signal_type: string;
  smart_buy: number;
  smart_sell: number;
  signal_1h_count: number;
  first_entry_price: number;
  price_change: number;
  link: string[];
  token: TokenData;
  recent_buys: string[];
  previous_signals: PreviousSignal[];
  is_first: boolean;
}
