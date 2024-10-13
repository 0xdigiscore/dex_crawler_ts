/*
  Warnings:

  - The `timestamp` column on the `TokenMetrics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GmgnSignal" ALTER COLUMN "from_timestamp" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "TokenMetrics" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" BIGINT;

-- AlterTable
ALTER TABLE "WalletActivity" ALTER COLUMN "timestamp" DROP NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE INDEX "TokenMetrics_chain_token_address_timestamp_idx" ON "TokenMetrics"("chain", "token_address", "timestamp");

-- CreateIndex
CREATE INDEX "TokenMetrics_timestamp_idx" ON "TokenMetrics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMetrics_chain_token_address_timestamp_key" ON "TokenMetrics"("chain", "token_address", "timestamp");
