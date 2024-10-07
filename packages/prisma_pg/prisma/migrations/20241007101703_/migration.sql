/*
  Warnings:

  - A unique constraint covering the columns `[chain,token_address,wallet_address,hour_timestamp]` on the table `TopTrader` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hour_timestamp` to the `TopTrader` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TopTrader_chain_token_address_wallet_address_key";

-- AlterTable
ALTER TABLE "TopTrader" ADD COLUMN     "hour_timestamp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TopTrader_chain_token_address_wallet_address_hour_timestamp_key" ON "TopTrader"("chain", "token_address", "wallet_address", "hour_timestamp");
