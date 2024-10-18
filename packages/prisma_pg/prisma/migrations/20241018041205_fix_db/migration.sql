/*
  Warnings:

  - You are about to alter the column `lock_info_rate` on the `TokenSecurity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `top_10_holder_rate` on the `TokenSecurity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "TokenSecurity" ALTER COLUMN "lock_info_rate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "top_10_holder_rate" SET DATA TYPE DECIMAL(10,2);
