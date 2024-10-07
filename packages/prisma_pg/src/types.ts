export interface TokenData {
  chain: string;
  token_address: string;
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
  total_supply: number;
  description: String;

  website: string;
  telegram: string;
  twitter_username: string;

  top_pools: string;
  pool_creation_timestamp: number;
  deploy_time: number;

  is_open_source: boolean | null;
  is_honeypot: boolean | null;
  is_show_alert: boolean | null;
  is_renounced: boolean | null;
  cto_flag: number | null;
  buy_tax: number | null;
  sell_tax: number | null;
  lockInfo: object | null;
  creator_token_status: string | null;
  creator_close: boolean | null;
  can_mint: boolean;
  has_renounced_ownership: boolean;
}

export interface HotTokenData {
  chain: string;
  token_address: string;
  hour_timestamp: Date; // 记录对应的小时时间戳
}

export interface TokenMetricsData {
  id: number;
  chain: string;
  token_address: string;
  token: TokenData;
  timestamp: Date;

  price?: number;
  market_cap?: number;
  fully_diluted_valuation?: number;
  liquidity?: number;
  volume_24h?: number;
  holder_count?: number;
  swaps?: number;
  buys?: number;
  sells?: number;

  price_change_1h?: number;
  price_change_24h?: number;
  price_change_percent?: number;
  price_change_percent1h?: number;
  price_change_percent1m?: number;
  price_change_percent5m?: number;

  transactions_1h_buys?: number;
  transactions_1h_sells?: number;
  transactions_24h_buys?: number;
  transactions_24h_sells?: number;

  smart_buy_24h?: number;
  smart_sell_24h?: number;

  hot_level?: number;
  call_number?: number;
  rat_trader_amount_rate?: number;

  created_at: Date;
}
