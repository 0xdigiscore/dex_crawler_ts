/*
  Warnings:

  - A unique constraint covering the columns `[chain,token_address,wallet_address]` on the table `TopTrader` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TopTrader_chain_token_address_wallet_address_hour_timestamp_key";

-- CreateIndex
CREATE UNIQUE INDEX "TopTrader_chain_token_address_wallet_address_key" ON "TopTrader"("chain", "token_address", "wallet_address");
