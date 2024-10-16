/*
  Warnings:

  - You are about to drop the column `enter_price` on the `ExecutedSignal` table. All the data in the column will be lost.
  - You are about to drop the column `holder_count` on the `ExecutedSignal` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `ExecutedSignal` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ExecutedSignal` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `ExecutedSignal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExecutedSignal" DROP COLUMN "enter_price",
DROP COLUMN "holder_count",
DROP COLUMN "metadata",
DROP COLUMN "user_id",
DROP COLUMN "user_name";

-- CreateTable
CREATE TABLE "UserOrder" (
    "id" SERIAL NOT NULL,
    "signal_id" INTEGER NOT NULL,
    "user_id" VARCHAR(255),
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "chain" VARCHAR(255),
    "token_address" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL DEFAULT 'pending',
    "enter_price" DECIMAL(65,30),
    "holder_count" INTEGER,
    "user_name" VARCHAR(255),
    "order_metadata" JSONB,

    CONSTRAINT "UserOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOrder_id_key" ON "UserOrder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_order_chain" ON "UserOrder"("user_id", "chain", "token_address");

-- AddForeignKey
ALTER TABLE "UserOrder" ADD CONSTRAINT "UserOrder_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "GmgnSignal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
