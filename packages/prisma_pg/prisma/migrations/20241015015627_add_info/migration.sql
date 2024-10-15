-- AlterTable
ALTER TABLE "TokenSecurity" ADD COLUMN     "holder_count" INTEGER,
ADD COLUMN     "lock_info_rate" DECIMAL(65,30),
ADD COLUMN     "top_10_holder_rate" DECIMAL(65,30);
