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
  swaps: number;
  id: {
    pairAddress: string;
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
      marketCap?: number;
      holdersUpdatedAt: Date;
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
  created_at?: Date;
}
