-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(255),
    "name" VARCHAR(255),
    "logo" TEXT,
    "decimals" INTEGER,
    "total_supply" DECIMAL(65,30),
    "website" TEXT,
    "telegram" TEXT,
    "twitter_username" VARCHAR(255),
    "is_open_source" BOOLEAN,
    "pool_creation_timestamp" BIGINT,
    "is_honeypot" BOOLEAN,
    "buy_tax" DECIMAL(65,30),
    "sell_tax" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "can_mint" BOOLEAN,
    "has_renounced_ownership" BOOLEAN,
    "top_pools" TEXT,
    "description" TEXT,
    "creator_close" BOOLEAN,
    "creator_token_status" VARCHAR(255),
    "cto_flag" INTEGER,
    "is_show_alert" BOOLEAN,
    "lockInfo" JSONB,
    "renounced" INTEGER,
    "call_number" INTEGER,
    "hot_level" INTEGER,
    "rat_trader_amount_rate" DECIMAL(65,30),
    "average_tax" DECIMAL,
    "bluechip_owner_count" INTEGER,
    "bluechip_owner_percentage" DOUBLE PRECISION,
    "degen_call_count" INTEGER,
    "honeypot" INTEGER,
    "signal_count" INTEGER,
    "top_10_holder_rate" DECIMAL,
    "top_fresh_wallet_count" INTEGER,
    "top_rat_trader_amount_percentage" DOUBLE PRECISION,
    "top_rat_trader_count" INTEGER,
    "top_smart_degen_count" INTEGER,
    "top_trader_fresh_wallet_count" INTEGER,
    "top_trader_rat_trader_amount_percentage" DOUBLE PRECISION,
    "top_trader_rat_trader_count" INTEGER,
    "top_trader_smart_degen_count" INTEGER,
    "deploy_time" BIGINT,
    "score" DECIMAL(65,30),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenSecurity" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "buy_tax" TEXT,
    "creator_address" TEXT,
    "creator_balance" TEXT,
    "creator_percent" TEXT,
    "external_call" TEXT,
    "lp_total_supply" TEXT,
    "note" TEXT,
    "other_potential_risks" TEXT,
    "owner_address" TEXT,
    "owner_balance" TEXT,
    "owner_change_balance" TEXT,
    "owner_percent" TEXT,
    "personal_slippage_modifiable" TEXT,
    "selfdestruct" TEXT,
    "sell_tax" TEXT,
    "slippage_modifiable" TEXT,
    "token_name" TEXT,
    "token_symbol" TEXT,
    "total_supply" TEXT,
    "trading_cooldown" TEXT,
    "trust_list" TEXT,
    "hidden_owner" INTEGER,
    "anti_whale_modifiable" INTEGER,
    "can_take_back_ownership" INTEGER,
    "cannot_buy" INTEGER,
    "cannot_sell_all" INTEGER,
    "honeypot_with_same_creator" INTEGER,
    "is_airdrop_scam" INTEGER,
    "is_anti_whale" INTEGER,
    "is_blacklisted" INTEGER,
    "is_honeypot" INTEGER,
    "is_in_dex" INTEGER,
    "is_mintable" INTEGER,
    "is_open_source" INTEGER,
    "is_proxy" INTEGER,
    "is_true_token" INTEGER,
    "is_whitelisted" INTEGER,
    "lp_holder_count" INTEGER,
    "transfer_pausable" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "holder_count" INTEGER,
    "lock_info_rate" DECIMAL(10,2),
    "top_10_holder_rate" DECIMAL(10,2),
    "is_burn" INTEGER,

    CONSTRAINT "TokenSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopBuysStats" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "holder_count_70" INTEGER NOT NULL,
    "hold" INTEGER NOT NULL,
    "bought_more" INTEGER NOT NULL,
    "sold_part" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "transferred" INTEGER NOT NULL,
    "bought_rate" DECIMAL(65,30) NOT NULL,
    "holding_rate" DECIMAL(65,30) NOT NULL,
    "smart_pos" JSONB,
    "smart_count_hold" INTEGER,
    "smart_count_bought_more" INTEGER,
    "smart_count_sold_part" INTEGER,
    "smart_count_sold" INTEGER,
    "smart_count_transferred" INTEGER,
    "top_10_holder_rate" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopBuysStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopBuysWallet" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "wallet_address" VARCHAR(255) NOT NULL,
    "wallet_tag" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "TopBuysWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMetrics" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION,
    "market_cap" DOUBLE PRECISION,
    "fully_diluted_valuation" DOUBLE PRECISION,
    "liquidity" DOUBLE PRECISION,
    "volume_24h" DOUBLE PRECISION,
    "holder_count" INTEGER,
    "swaps" INTEGER,
    "buys" INTEGER,
    "sells" INTEGER,
    "price_change_1h" DOUBLE PRECISION,
    "price_change_24h" DOUBLE PRECISION,
    "price_change_percent" DECIMAL(65,30),
    "price_change_percent1h" DECIMAL(65,30),
    "price_change_percent1m" DECIMAL(65,30),
    "price_change_percent5m" DECIMAL(65,30),
    "transactions_1h_buys" INTEGER,
    "transactions_1h_sells" INTEGER,
    "transactions_24h_buys" INTEGER,
    "transactions_24h_sells" INTEGER,
    "smart_buy_24h" INTEGER,
    "smart_sell_24h" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "holdersUpdatedAt" TIMESTAMP(3),
    "initial_liquidity" DOUBLE PRECISION,
    "liquidityUpdatedAt" TIMESTAMP(3),
    "pair_address" VARCHAR(255),
    "reserve" DOUBLE PRECISION,
    "tx_count" INTEGER,
    "timestamp" BIGINT,

    CONSTRAINT "TokenMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotToken" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "hour_timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopTrader" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "wallet_address" VARCHAR(255) NOT NULL,
    "realized_profit" DECIMAL(65,30),
    "unrealized_profit" DECIMAL(65,30),
    "profit" DECIMAL(65,30),
    "profit_change" DECIMAL(65,30),
    "buy_amount" DECIMAL(65,30),
    "buy_amount_cur" DECIMAL(65,30),
    "sell_amount" DECIMAL(65,30),
    "sell_amount_cur" DECIMAL(65,30),
    "buy_tx_count" INTEGER,
    "buy_tx_count_cur" INTEGER,
    "sell_tx_count" INTEGER,
    "sell_tx_count_cur" INTEGER,
    "last_trade_at" TIMESTAMP(3),
    "addr_type" INTEGER,
    "amount_cur" DECIMAL(65,30),
    "usd_value" DECIMAL(65,30),
    "cost_cur" DECIMAL(65,30),
    "sell_amount_percentage" DECIMAL(65,30),
    "sell_volume_cur" DECIMAL(65,30),
    "buy_volume_cur" DECIMAL(65,30),
    "netflow_usd" DECIMAL(65,30),
    "netflow_amount" DECIMAL(65,30),
    "wallet_tag_v2" VARCHAR(255),
    "eth_balance" TEXT,
    "sol_balance" TEXT,
    "trx_balance" TEXT,
    "balance" TEXT,
    "amount_percentage" DECIMAL(65,30),
    "unrealized_pnl" DECIMAL(65,30),
    "avg_cost" DECIMAL(65,30),
    "avg_sold" DECIMAL(65,30),
    "accu_amount" DECIMAL(65,30),
    "accu_cost" DECIMAL(65,30),
    "cost" DECIMAL(65,30),
    "total_cost" DECIMAL(65,30),
    "name" TEXT,
    "avatar" TEXT,
    "twitter_username" VARCHAR(255),
    "twitter_name" VARCHAR(255),
    "tags" TEXT[],
    "maker_token_tags" TEXT[],
    "tag_rank" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hour_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopTrader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartWallet" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(255),
    "wallet_address" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "realized_profit" DECIMAL(65,30),
    "buy" INTEGER NOT NULL DEFAULT 0,
    "sell" INTEGER NOT NULL DEFAULT 0,
    "last_active" DECIMAL(65,30),
    "realized_profit_1d" DECIMAL(65,30),
    "realized_profit_7d" DECIMAL(65,30),
    "realized_profit_30d" DECIMAL(65,30),
    "pnl_30d" DECIMAL(65,30),
    "pnl_7d" DECIMAL(65,30),
    "pnl_1d" DECIMAL(65,30),
    "txs_30d" INTEGER,
    "buy_30d" INTEGER,
    "sell_30d" INTEGER,
    "eth_balance" TEXT,
    "sol_balance" TEXT,
    "trx_balance" TEXT,
    "balance" TEXT,
    "twitter_username" VARCHAR(255),
    "avatar" TEXT,
    "ens" VARCHAR(255),
    "tag_rank" JSONB,
    "tags" TEXT[],
    "maker_avatar_color" VARCHAR(255),
    "twitter_name" VARCHAR(255),
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "is_blue_verified" BOOLEAN NOT NULL DEFAULT false,
    "twitter_description" TEXT,
    "avg_hold_time" DECIMAL(65,30),
    "winrate_7d" DECIMAL(65,30),
    "avg_cost_7d" DECIMAL(65,30),
    "pnl_lt_minus_dot5_num_7d" INTEGER NOT NULL DEFAULT 0,
    "pnl_minus_dot5_0x_num_7d" INTEGER NOT NULL DEFAULT 0,
    "pnl_lt_2x_num_7d" INTEGER NOT NULL DEFAULT 0,
    "pnl_2x_5x_num_7d" INTEGER NOT NULL DEFAULT 0,
    "pnl_gt_5x_num_7d" INTEGER NOT NULL DEFAULT 0,
    "daily_profit_7d" JSONB,
    "recent_buy_tokens" JSONB,
    "txs" INTEGER NOT NULL DEFAULT 0,
    "score" DECIMAL(65,30) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletActivity" (
    "id" SERIAL NOT NULL,
    "wallet_address" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "timestamp" BIGINT,
    "event_type" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "token" JSONB,
    "token_amount" VARCHAR(255),
    "quote_amount" VARCHAR(255),
    "cost_usd" DOUBLE PRECISION,
    "buy_cost_usd" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "price_usd" DOUBLE PRECISION,
    "is_open_or_close" INTEGER,
    "quote_address" VARCHAR(255) NOT NULL,
    "quote_token" JSONB,
    "from_address" VARCHAR(255),
    "from_is_contract" BOOLEAN,
    "to_address" VARCHAR(255),
    "to_is_contract" BOOLEAN,
    "balance" VARCHAR(255),
    "sell_30d" INTEGER,
    "last_active_timestamp" INTEGER,
    "smartWalletId" INTEGER,

    CONSTRAINT "WalletActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmgnSignal" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "source" VARCHAR(255) NOT NULL DEFAULT 'gmgn_web',
    "signal_id" INTEGER,
    "maker" TEXT,
    "token_address" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_price" DECIMAL(65,30),
    "from_timestamp" BIGINT,
    "updated_at" TIMESTAMP(3),
    "buy_duration" INTEGER,
    "buy_usd" DECIMAL(65,30),
    "tx_count" INTEGER,
    "signal_type" VARCHAR(255),
    "smart_buy" INTEGER,
    "smart_sell" INTEGER,
    "signal_1h_count" INTEGER,
    "score" DECIMAL(65,30),
    "first_entry_price" DECIMAL(65,30),
    "price_change" DOUBLE PRECISION,
    "link" JSONB,
    "recent_buys" JSONB,
    "is_first" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token_symbol" VARCHAR(255),
    "raw_data" JSONB,
    "occurrence_count" INTEGER DEFAULT 1,
    "last_occurrence" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmgnSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutedSignal" (
    "id" SERIAL NOT NULL,
    "signal_id" INTEGER NOT NULL,
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "chain" VARCHAR(255),
    "token_address" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL DEFAULT 'pending',

    CONSTRAINT "ExecutedSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrder" (
    "id" SERIAL NOT NULL,
    "signal_id" INTEGER NOT NULL,
    "user_id" VARCHAR(255),
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "chain" VARCHAR(255),
    "token_address" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL DEFAULT 'pending',
    "enter_price" DECIMAL(65,30),
    "holder_count" INTEGER,
    "user_name" VARCHAR(255),
    "order_metadata" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "title" VARCHAR NOT NULL,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Token_chain_idx" ON "Token"("chain");

-- CreateIndex
CREATE INDEX "Token_token_address_idx" ON "Token"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chain_token_address_key" ON "Token"("chain", "token_address");

-- CreateIndex
CREATE INDEX "TokenSecurity_chain_idx" ON "TokenSecurity"("chain");

-- CreateIndex
CREATE INDEX "TokenSecurity_token_address_idx" ON "TokenSecurity"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSecurity_chain_token_address_key" ON "TokenSecurity"("chain", "token_address");

-- CreateIndex
CREATE INDEX "TopBuysStats_chain_idx" ON "TopBuysStats"("chain");

-- CreateIndex
CREATE INDEX "TopBuysStats_token_address_idx" ON "TopBuysStats"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TopBuysStats_chain_token_address_key" ON "TopBuysStats"("chain", "token_address");

-- CreateIndex
CREATE INDEX "TopBuysWallet_chain_idx" ON "TopBuysWallet"("chain");

-- CreateIndex
CREATE INDEX "TopBuysWallet_token_address_idx" ON "TopBuysWallet"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TopBuysWallet_chain_token_address_wallet_address_key" ON "TopBuysWallet"("chain", "token_address", "wallet_address");

-- CreateIndex
CREATE INDEX "TokenMetrics_chain_token_address_timestamp_idx" ON "TokenMetrics"("chain", "token_address", "timestamp");

-- CreateIndex
CREATE INDEX "TokenMetrics_timestamp_idx" ON "TokenMetrics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetrics_chain_token_address_timestamp_key" ON "TokenMetrics"("chain", "token_address", "timestamp");

-- CreateIndex
CREATE INDEX "HotToken_chain_token_address_hour_timestamp_idx" ON "HotToken"("chain", "token_address", "hour_timestamp");

-- CreateIndex
CREATE INDEX "HotToken_hour_timestamp_idx" ON "HotToken"("hour_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "HotToken_chain_token_address_hour_timestamp_key" ON "HotToken"("chain", "token_address", "hour_timestamp");

-- CreateIndex
CREATE INDEX "TopTrader_chain_idx" ON "TopTrader"("chain");

-- CreateIndex
CREATE INDEX "TopTrader_token_address_idx" ON "TopTrader"("token_address");

-- CreateIndex
CREATE INDEX "TopTrader_wallet_address_idx" ON "TopTrader"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "TopTrader_chain_token_address_wallet_address_key" ON "TopTrader"("chain", "token_address", "wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "SmartWallet_wallet_address_key" ON "SmartWallet"("wallet_address");

-- CreateIndex
CREATE INDEX "SmartWallet_wallet_address_idx" ON "SmartWallet"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "SmartWallet_chain_wallet_address_key" ON "SmartWallet"("chain", "wallet_address");

-- CreateIndex
CREATE INDEX "WalletActivity_wallet_address_idx" ON "WalletActivity"("wallet_address");

-- CreateIndex
CREATE INDEX "WalletActivity_tx_hash_idx" ON "WalletActivity"("tx_hash");

-- CreateIndex
CREATE INDEX "WalletActivity_token_address_idx" ON "WalletActivity"("token_address");

-- CreateIndex
CREATE INDEX "WalletActivity_quote_address_idx" ON "WalletActivity"("quote_address");

-- CreateIndex
CREATE UNIQUE INDEX "WalletActivity_chain_wallet_address_tx_hash_key" ON "WalletActivity"("chain", "wallet_address", "tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_signal_id_key" ON "GmgnSignal"("signal_id");

-- CreateIndex
CREATE INDEX "GmgnSignal_chain_token_address_idx" ON "GmgnSignal"("chain", "token_address");

-- CreateIndex
CREATE INDEX "GmgnSignal_source_chain_token_address_idx" ON "GmgnSignal"("source", "chain", "token_address");

-- CreateIndex
CREATE INDEX "GmgnSignal_last_occurrence_idx" ON "GmgnSignal"("last_occurrence");

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_source_chain_token_address_signal_type_timestamp_key" ON "GmgnSignal"("source", "chain", "token_address", "signal_type", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ExecutedSignal_signal_id_key" ON "ExecutedSignal"("signal_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_token_chain" ON "ExecutedSignal"("token_address", "chain");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrder_id_key" ON "UserOrder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_order_chain" ON "UserOrder"("user_id", "chain", "token_address");

-- CreateIndex
CREATE UNIQUE INDEX "groups_chat_id_key" ON "groups"("chat_id");

-- CreateIndex
CREATE INDEX "ix_groups_id" ON "groups"("id");

-- AddForeignKey
ALTER TABLE "TokenSecurity" ADD CONSTRAINT "TokenSecurity_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopBuysStats" ADD CONSTRAINT "TopBuysStats_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopBuysWallet" ADD CONSTRAINT "TopBuysWallet_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenMetrics" ADD CONSTRAINT "TokenMetrics_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotToken" ADD CONSTRAINT "HotToken_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTrader" ADD CONSTRAINT "TopTrader_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletActivity" ADD CONSTRAINT "WalletActivity_smartWalletId_fkey" FOREIGN KEY ("smartWalletId") REFERENCES "SmartWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmgnSignal" ADD CONSTRAINT "GmgnSignal_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutedSignal" ADD CONSTRAINT "ExecutedSignal_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "GmgnSignal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserOrder" ADD CONSTRAINT "UserOrder_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "GmgnSignal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
