-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "average_tax" DECIMAL,
ADD COLUMN     "bluechip_owner_count" INTEGER,
ADD COLUMN     "bluechip_owner_percentage" DOUBLE PRECISION,
ADD COLUMN     "degen_call_count" INTEGER,
ADD COLUMN     "honeypot" INTEGER,
ADD COLUMN     "signal_count" INTEGER,
ADD COLUMN     "top_10_holder_rate" DECIMAL,
ADD COLUMN     "top_fresh_wallet_count" INTEGER,
ADD COLUMN     "top_rat_trader_amount_percentage" DOUBLE PRECISION,
ADD COLUMN     "top_rat_trader_count" INTEGER,
ADD COLUMN     "top_smart_degen_count" INTEGER,
ADD COLUMN     "top_trader_fresh_wallet_count" INTEGER,
ADD COLUMN     "top_trader_rat_trader_amount_percentage" DOUBLE PRECISION,
ADD COLUMN     "top_trader_rat_trader_count" INTEGER,
ADD COLUMN     "top_trader_smart_degen_count" INTEGER;

-- CreateTable
CREATE TABLE "ExecutedSignal" (
    "id" SERIAL NOT NULL,
    "signal_id" INTEGER NOT NULL,
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "chain" VARCHAR(255),
    "token_address" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL DEFAULT 'pending',

    CONSTRAINT "ExecutedSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "title" VARCHAR NOT NULL,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutedSignal_signal_id_key" ON "ExecutedSignal"("signal_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_token_chain" ON "ExecutedSignal"("token_address", "chain");

-- CreateIndex
CREATE UNIQUE INDEX "groups_chat_id_key" ON "groups"("chat_id");

-- CreateIndex
CREATE INDEX "ix_groups_id" ON "groups"("id");

-- AddForeignKey
ALTER TABLE "ExecutedSignal" ADD CONSTRAINT "ExecutedSignal_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "GmgnSignal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
