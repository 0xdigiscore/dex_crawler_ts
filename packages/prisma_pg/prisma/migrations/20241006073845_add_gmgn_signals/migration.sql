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
    "renounced" BOOLEAN,
    "pool_creation_timestamp" BIGINT,
    "is_honeypot" BOOLEAN,
    "buy_tax" DECIMAL(65,30),
    "sell_tax" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "market_cap" DOUBLE PRECISION,
    "fully_diluted_valuation" DOUBLE PRECISION,
    "liquidity" DOUBLE PRECISION,
    "volume_24h" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "deploy_time" TIMESTAMP(3),
    "can_mint" BOOLEAN,
    "has_renounced_ownership" BOOLEAN,
    "top_pools" TEXT,
    "description" TEXT,
    "price_change_1h" DOUBLE PRECISION,
    "price_change_24h" DOUBLE PRECISION,
    "transactions_1h_buys" INTEGER,
    "transactions_1h_sells" INTEGER,
    "transactions_24h_buys" INTEGER,
    "transactions_24h_sells" INTEGER,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotToken" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "price" DECIMAL(65,30),
    "price_change_percent" DECIMAL(65,30),
    "price_change_percent1h" DECIMAL(65,30),
    "price_change_percent1m" DECIMAL(65,30),
    "price_change_percent5m" DECIMAL(65,30),
    "swaps" INTEGER,
    "volume" DECIMAL(65,30),
    "liquidity" DECIMAL(65,30),
    "market_cap" DECIMAL(65,30),
    "hot_level" INTEGER,
    "call_number" INTEGER,
    "smart_buy_24h" INTEGER,
    "smart_sell_24h" INTEGER,
    "open_timestamp" BIGINT,
    "holder_count" INTEGER,
    "is_show_alert" BOOLEAN,
    "buys" INTEGER,
    "sells" INTEGER,
    "lockInfo" JSONB,
    "creator_token_status" VARCHAR(255),
    "creator_close" BOOLEAN,
    "rat_trader_amount_rate" DECIMAL(65,30),
    "cto_flag" INTEGER,
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
    "timestamp" INTEGER NOT NULL,
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
    "maker" TEXT,
    "token_address" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_price" DECIMAL(65,30) NOT NULL,
    "from_timestamp" BIGINT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "buy_duration" INTEGER NOT NULL,
    "buy_usd" DECIMAL(65,30) NOT NULL,
    "tx_count" INTEGER NOT NULL,
    "signal_type" VARCHAR(255) NOT NULL,
    "smart_buy" INTEGER NOT NULL,
    "smart_sell" INTEGER NOT NULL,
    "signal_1h_count" INTEGER NOT NULL,
    "first_entry_price" DECIMAL(65,30) NOT NULL,
    "price_change" DOUBLE PRECISION NOT NULL,
    "link" JSONB NOT NULL,
    "recent_buys" JSONB NOT NULL,
    "is_first" BOOLEAN NOT NULL,

    CONSTRAINT "GmgnSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GmgnSignalPreviousSignals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Token_chain_idx" ON "Token"("chain");

-- CreateIndex
CREATE INDEX "Token_token_address_idx" ON "Token"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chain_token_address_key" ON "Token"("chain", "token_address");

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
CREATE INDEX "GmgnSignal_chain_token_address_idx" ON "GmgnSignal"("chain", "token_address");

-- CreateIndex
CREATE UNIQUE INDEX "_GmgnSignalPreviousSignals_AB_unique" ON "_GmgnSignalPreviousSignals"("A", "B");

-- CreateIndex
CREATE INDEX "_GmgnSignalPreviousSignals_B_index" ON "_GmgnSignalPreviousSignals"("B");

-- AddForeignKey
ALTER TABLE "HotToken" ADD CONSTRAINT "HotToken_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTrader" ADD CONSTRAINT "TopTrader_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletActivity" ADD CONSTRAINT "WalletActivity_smartWalletId_fkey" FOREIGN KEY ("smartWalletId") REFERENCES "SmartWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmgnSignal" ADD CONSTRAINT "GmgnSignal_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GmgnSignalPreviousSignals" ADD CONSTRAINT "_GmgnSignalPreviousSignals_A_fkey" FOREIGN KEY ("A") REFERENCES "GmgnSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GmgnSignalPreviousSignals" ADD CONSTRAINT "_GmgnSignalPreviousSignals_B_fkey" FOREIGN KEY ("B") REFERENCES "GmgnSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
