/*
  Warnings:

  - You are about to alter the column `lock_info_rate` on the `TokenSecurity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `top_10_holder_rate` on the `TokenSecurity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `updated_at` to the `UserOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenSecurity" ALTER COLUMN "lock_info_rate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "top_10_holder_rate" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "UserOrder" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
