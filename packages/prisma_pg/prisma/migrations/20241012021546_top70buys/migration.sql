-- CreateTable
CREATE TABLE "TopBuys" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "holder_count_70" INTEGER NOT NULL,
    "hold" INTEGER NOT NULL,
    "bought_more" INTEGER NOT NULL,
    "sold_part" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "transferred" INTEGER NOT NULL,
    "bought_rate" DECIMAL(65,30) NOT NULL,
    "holding_rate" DECIMAL(65,30) NOT NULL,
    "smart_pos" JSONB,
    "smart_count_hold" INTEGER,
    "smart_count_bought_more" INTEGER,
    "smart_count_sold_part" INTEGER,
    "smart_count_sold" INTEGER,
    "smart_count_transferred" INTEGER,
    "top_10_holder_rate" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopBuys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopBuys_chain_idx" ON "TopBuys"("chain");

-- CreateIndex
CREATE INDEX "TopBuys_token_address_idx" ON "TopBuys"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TopBuys_chain_token_address_key" ON "TopBuys"("chain", "token_address");

-- AddForeignKey
ALTER TABLE "TopBuys" ADD CONSTRAINT "TopBuys_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;
