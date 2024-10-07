/*
  Warnings:

  - You are about to drop the column `call_number` on the `TokenMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `hot_level` on the `TokenMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `rat_trader_amount_rate` on the `TokenMetrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "call_number" INTEGER,
ADD COLUMN     "hot_level" INTEGER,
ADD COLUMN     "rat_trader_amount_rate" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "TokenMetrics" DROP COLUMN "call_number",
DROP COLUMN "hot_level",
DROP COLUMN "rat_trader_amount_rate";
