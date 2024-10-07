/*
  Warnings:

  - You are about to drop the column `buys` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `call_number` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `creator_close` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `creator_token_status` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `cto_flag` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `holder_count` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `hot_level` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `is_show_alert` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `liquidity` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `lockInfo` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `market_cap` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `open_timestamp` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_percent` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_percent1h` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_percent1m` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_percent5m` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `rat_trader_amount_rate` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `sells` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `smart_buy_24h` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `smart_sell_24h` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `swaps` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `HotToken` table. All the data in the column will be lost.
  - You are about to drop the column `fully_diluted_valuation` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `liquidity` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `market_cap` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_1h` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `price_change_24h` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `transactions_1h_buys` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `transactions_1h_sells` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `transactions_24h_buys` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `transactions_24h_sells` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `volume_24h` on the `Token` table. All the data in the column will be lost.
  - The `renounced` column on the `Token` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HotToken" DROP COLUMN "buys",
DROP COLUMN "call_number",
DROP COLUMN "creator_close",
DROP COLUMN "creator_token_status",
DROP COLUMN "cto_flag",
DROP COLUMN "holder_count",
DROP COLUMN "hot_level",
DROP COLUMN "is_show_alert",
DROP COLUMN "liquidity",
DROP COLUMN "lockInfo",
DROP COLUMN "market_cap",
DROP COLUMN "open_timestamp",
DROP COLUMN "price",
DROP COLUMN "price_change_percent",
DROP COLUMN "price_change_percent1h",
DROP COLUMN "price_change_percent1m",
DROP COLUMN "price_change_percent5m",
DROP COLUMN "rat_trader_amount_rate",
DROP COLUMN "sells",
DROP COLUMN "smart_buy_24h",
DROP COLUMN "smart_sell_24h",
DROP COLUMN "swaps",
DROP COLUMN "volume";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "fully_diluted_valuation",
DROP COLUMN "liquidity",
DROP COLUMN "market_cap",
DROP COLUMN "price",
DROP COLUMN "price_change_1h",
DROP COLUMN "price_change_24h",
DROP COLUMN "transactions_1h_buys",
DROP COLUMN "transactions_1h_sells",
DROP COLUMN "transactions_24h_buys",
DROP COLUMN "transactions_24h_sells",
DROP COLUMN "volume_24h",
ADD COLUMN     "creator_close" BOOLEAN,
ADD COLUMN     "creator_token_status" VARCHAR(255),
ADD COLUMN     "cto_flag" INTEGER,
ADD COLUMN     "is_show_alert" BOOLEAN,
ADD COLUMN     "lockInfo" JSONB,
DROP COLUMN "renounced",
ADD COLUMN     "renounced" INTEGER;

-- CreateTable
CREATE TABLE "TokenMetrics" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
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
    "hot_level" INTEGER,
    "call_number" INTEGER,
    "rat_trader_amount_rate" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenMetrics_chain_token_address_timestamp_idx" ON "TokenMetrics"("chain", "token_address", "timestamp");

-- CreateIndex
CREATE INDEX "TokenMetrics_timestamp_idx" ON "TokenMetrics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetrics_chain_token_address_timestamp_key" ON "TokenMetrics"("chain", "token_address", "timestamp");

-- AddForeignKey
ALTER TABLE "TokenMetrics" ADD CONSTRAINT "TokenMetrics_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;
