// packages/gmgn_crawler/src/models/types.ts

export interface TokenData {
  chain: string;
  token_address: string;
  symbol?: string;
  name?: string;
  logo?: string;
  decimals?: number;
  total_supply?: number;
  website?: string;
  telegram?: string;
  twitter_username?: string;
  is_open_source?: boolean;
  renounced?: boolean;
  pool_creation_timestamp?: bigint;
  is_honeypot?: boolean;
  buy_tax?: number;
  sell_tax?: number;
  // 其他相关字段...
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
  link: LinkData;
  token: TokenData;
  recent_buys: RecentBuysData;
  previous_signals: PreviousSignal[];
  is_first: boolean;
  // 其他相关字段...
}
