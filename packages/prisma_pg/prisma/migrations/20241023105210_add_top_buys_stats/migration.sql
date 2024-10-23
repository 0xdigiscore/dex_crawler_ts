/*
  Warnings:

  - You are about to drop the `TopBuys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TopBuys" DROP CONSTRAINT "TopBuys_chain_token_address_fkey";

-- DropTable
DROP TABLE "TopBuys";

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

-- AddForeignKey
ALTER TABLE "TopBuysStats" ADD CONSTRAINT "TopBuysStats_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopBuysWallet" ADD CONSTRAINT "TopBuysWallet_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;
