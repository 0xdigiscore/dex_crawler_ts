// tokenMetricsUpdater.ts

// Interface for the Token model from the database
export interface Token {
  chain: string;
  token_address: string;
}

// Interface for the Dextools API response
export interface DextoolsResponse {
  results: DextoolsResult[];
  info: any;
  sponsored: any[];
}

// Interface for each result in the Dextools API response
export interface DextoolsResult {
  price: number;
  volume: number;
  price_timestamp: Date;
  creationTime: Date;
  swaps: number;
  id: {
    pair: string;
  };
  metrics: {
    liquidity: number;
    liquidityUpdatedAt: Date;
    txCount: number;
    initialLiquidity: number;
    initialLiquidityUpdatedAt: Date;

    reserve: number;
    reserveUpdatedAt: Date;
  };
  periodStats: {
    [key: string]: PeriodStats;
  };
  token: {
    metrics: {
      holders: number;
      fdv: number;
      holdersUpdatedAt: Date;
      txCount: number;
    };
    audit: {
      dextools: {
        is_open_source: string;
        is_honeypot: string;
        is_mintable: string;
        is_proxy: string;
        slippage_modifiable: string;
        is_blacklisted: string;
        sell_tax: {
          min: string | null;
          max: string | null;
          status: string;
        };
        buy_tax: {
          min: string | null;
          max: string | null;
          status: string;
        };
        is_contract_renounced: string;
        is_potentially_scam: string;
        transfer_pausable: string;
      };
    };
  };
}

// Interface for period stats (e.g., "1h", "24h")
export interface PeriodStats {
  volume: {
    total: number;
    buys: number;
    sells: number;
  };
  swaps: {
    total: number;
    buys: number;
    sells: number;
  };
  price: {
    usd: {
      first: number;
      last: number;
      min: number;
      max: number;
      diff: number;
    };
  };
}

// Interface for the TokenMetrics data model
export interface TokenMetrics {
  chain: string;
  token_address: string;
  timestamp?: BigInt;
  token_deploy_timestamp?: BigInt;
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
  created_at?: Date;
  pair_address?: string;
  tx_count?: number;
  holdersUpdatedAt?: Date;
  initial_liquidity?: number;
  initial_liquidity_updated_at?: Date;
  reserve?: number;
}

export interface TokenSecurityData {
  chain: string;
  token_address: string;
  anti_whale_modifiable?: number;
  buy_tax?: string;
  can_take_back_ownership?: number;
  is_contract_renounced?: number;
  cannot_buy?: number;
  cannot_sell_all?: number;
  creator_address?: string;
  creator_balance?: string;
  creator_percent?: string;
  external_call?: string;
  hidden_owner?: number;
  holder_count?: number;
  honeypot_with_same_creator?: string;
  is_anti_whale?: number;
  is_blacklisted?: number;
  is_honeypot?: number;
  is_in_dex?: number;
  is_mintable?: number;
  is_open_source?: number;
  is_proxy?: number;
  is_whitelisted?: number;
  lp_holder_count?: number;
  lp_total_supply?: string;
  owner_address?: string;
  owner_balance?: string;
  owner_change_balance?: string;
  owner_percent?: string;
  personal_slippage_modifiable?: number;
  selfdestruct?: string;
  sell_tax?: string;
  slippage_modifiable?: number;
  token_name?: string;
  token_symbol?: string;
  total_supply?: string;
  trading_cooldown?: string;
  transfer_pausable?: number;
  is_airdrop_scam?: string | null; // Optional
  is_true_token?: string | null; // Optional
  note?: string | null; // Optional
  other_potential_risks?: string | null; // Optional
  trust_list?: string | null; // Optional
}
