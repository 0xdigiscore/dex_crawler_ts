-- CreateTable
CREATE TABLE "TokenSecurity" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "anti_whale_modifiable" TEXT,
    "buy_tax" TEXT,
    "can_take_back_ownership" TEXT,
    "cannot_buy" TEXT,
    "cannot_sell_all" TEXT,
    "creator_address" TEXT,
    "creator_balance" TEXT,
    "creator_percent" TEXT,
    "external_call" TEXT,
    "honeypot_with_same_creator" TEXT,
    "is_airdrop_scam" TEXT,
    "is_anti_whale" TEXT,
    "is_blacklisted" TEXT,
    "is_honeypot" TEXT,
    "is_in_dex" TEXT,
    "is_mintable" TEXT,
    "is_open_source" TEXT,
    "is_proxy" TEXT,
    "is_true_token" TEXT,
    "is_whitelisted" TEXT,
    "lp_holder_count" TEXT,
    "lp_total_supply" TEXT,
    "note" TEXT,
    "other_potential_risks" TEXT,
    "owner_address" TEXT,
    "owner_balance" TEXT,
    "owner_change_balance" TEXT,
    "owner_percent" TEXT,
    "personal_slippage_modifiable" TEXT,
    "selfdestruct" TEXT,
    "sell_tax" TEXT,
    "slippage_modifiable" TEXT,
    "token_name" TEXT,
    "token_symbol" TEXT,
    "total_supply" TEXT,
    "trading_cooldown" TEXT,
    "transfer_pausable" TEXT,
    "trust_list" TEXT,

    CONSTRAINT "TokenSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenSecurity_chain_idx" ON "TokenSecurity"("chain");

-- CreateIndex
CREATE INDEX "TokenSecurity_token_address_idx" ON "TokenSecurity"("token_address");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSecurity_chain_token_address_key" ON "TokenSecurity"("chain", "token_address");

-- AddForeignKey
ALTER TABLE "TokenSecurity" ADD CONSTRAINT "TokenSecurity_chain_token_address_fkey" FOREIGN KEY ("chain", "token_address") REFERENCES "Token"("chain", "token_address") ON DELETE RESTRICT ON UPDATE CASCADE;
