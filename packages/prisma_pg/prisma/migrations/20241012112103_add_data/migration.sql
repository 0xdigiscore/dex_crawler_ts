-- AlterTable
ALTER TABLE "TokenMetrics" ADD COLUMN     "holdersUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "initial_liquidity" DOUBLE PRECISION,
ADD COLUMN     "liquidityUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "pair_address" VARCHAR(255),
ADD COLUMN     "reserve" DOUBLE PRECISION,
ADD COLUMN     "reserveUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "tx_count" INTEGER;
