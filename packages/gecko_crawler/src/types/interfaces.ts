// interfaces.ts

export interface Token {
  chain: string;
  token_address: string;
  created_at?: Date;
}

export interface TokenSecurityData {
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

export interface TokenStatsData {
  signal_count: number;
  degen_call_count: number;
  rat_trader_count: number;
  top_rat_trader_count: number;
  top_smart_degen_count: number;
  top_fresh_wallet_count: number;
  top_rat_trader_amount_percentage: number;
  top_trader_rat_trader_count: number;
  top_trader_rat_trader_amount_percentage: number;
  top_trader_smart_degen_count: number;
  top_trader_fresh_wallet_count: number;
  bluechip_owner_count: number;
  bluechip_owner_percentage: number;
}

export interface HolderData {
  chain: string;
  holder_count: number;
  statusNow: {
    hold: number;
    bought_more: number;
    sold_part: number;
    sold: number;
    transfered: number;
    bought_rate: string;
    holding_rate: string;
    smart_pos: number[];
    smart_count_hold: number | null;
    smart_count_bought_more: number | null;
    smart_count_sold_part: number | null;
    smart_count_sold: number | null;
    smart_count_transfered: number | null;
    top_10_holder_rate: number;
  };
}

export type RequestType = 'security' | 'stats' | 'top_buys';
