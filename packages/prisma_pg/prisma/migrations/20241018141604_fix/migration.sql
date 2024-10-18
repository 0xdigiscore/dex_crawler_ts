/*
  Warnings:

  - A unique constraint covering the columns `[signal_id]` on the table `GmgnSignal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GmgnSignal_id_key";

-- AlterTable
CREATE SEQUENCE gmgnsignal_id_seq;
ALTER TABLE "GmgnSignal" ADD COLUMN     "signal_id" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('gmgnsignal_id_seq');
ALTER SEQUENCE gmgnsignal_id_seq OWNED BY "GmgnSignal"."id";

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_signal_id_key" ON "GmgnSignal"("signal_id");

-- CreateIndex
CREATE INDEX "GmgnSignal_source_chain_token_address_idx" ON "GmgnSignal"("source", "chain", "token_address");
