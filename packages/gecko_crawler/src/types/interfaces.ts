// interfaces.ts

export interface Token {
  chain: string;
  token_address: string;
  created_at?: Date;
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

export type RequestType = 'security' | 'stats' | 'top_buys_stats';
