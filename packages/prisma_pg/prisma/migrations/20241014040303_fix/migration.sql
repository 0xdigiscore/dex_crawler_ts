/*
  Warnings:

  - The `anti_whale_modifiable` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `can_take_back_ownership` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cannot_buy` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cannot_sell_all` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `honeypot_with_same_creator` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_airdrop_scam` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_anti_whale` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_blacklisted` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_honeypot` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_in_dex` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_mintable` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_open_source` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_proxy` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_true_token` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `is_whitelisted` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lp_holder_count` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transfer_pausable` column on the `TokenSecurity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TokenSecurity" ADD COLUMN     "hidden_owner" INTEGER,
DROP COLUMN "anti_whale_modifiable",
ADD COLUMN     "anti_whale_modifiable" INTEGER,
DROP COLUMN "can_take_back_ownership",
ADD COLUMN     "can_take_back_ownership" INTEGER,
DROP COLUMN "cannot_buy",
ADD COLUMN     "cannot_buy" INTEGER,
DROP COLUMN "cannot_sell_all",
ADD COLUMN     "cannot_sell_all" INTEGER,
DROP COLUMN "honeypot_with_same_creator",
ADD COLUMN     "honeypot_with_same_creator" INTEGER,
DROP COLUMN "is_airdrop_scam",
ADD COLUMN     "is_airdrop_scam" INTEGER,
DROP COLUMN "is_anti_whale",
ADD COLUMN     "is_anti_whale" INTEGER,
DROP COLUMN "is_blacklisted",
ADD COLUMN     "is_blacklisted" INTEGER,
DROP COLUMN "is_honeypot",
ADD COLUMN     "is_honeypot" INTEGER,
DROP COLUMN "is_in_dex",
ADD COLUMN     "is_in_dex" INTEGER,
DROP COLUMN "is_mintable",
ADD COLUMN     "is_mintable" INTEGER,
DROP COLUMN "is_open_source",
ADD COLUMN     "is_open_source" INTEGER,
DROP COLUMN "is_proxy",
ADD COLUMN     "is_proxy" INTEGER,
DROP COLUMN "is_true_token",
ADD COLUMN     "is_true_token" INTEGER,
DROP COLUMN "is_whitelisted",
ADD COLUMN     "is_whitelisted" INTEGER,
DROP COLUMN "lp_holder_count",
ADD COLUMN     "lp_holder_count" INTEGER,
DROP COLUMN "transfer_pausable",
ADD COLUMN     "transfer_pausable" INTEGER;
