/*
  Warnings:

  - You are about to alter the column `from_timestamp` on the `GmgnSignal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "GmgnSignal" ALTER COLUMN "from_timestamp" SET DATA TYPE INTEGER;
