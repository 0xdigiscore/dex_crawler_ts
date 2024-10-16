-- AlterTable
ALTER TABLE "ExecutedSignal" ADD COLUMN     "enter_price" DECIMAL(65,30),
ADD COLUMN     "holder_count" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "user_id" VARCHAR(255),
ADD COLUMN     "user_name" VARCHAR(255);
