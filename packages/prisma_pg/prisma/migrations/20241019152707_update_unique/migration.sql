/*
  Warnings:

  - A unique constraint covering the columns `[source,chain,token_address,signal_type,timestamp]` on the table `GmgnSignal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GmgnSignal_source_chain_token_address_signal_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_source_chain_token_address_signal_type_timestamp_key" ON "GmgnSignal"("source", "chain", "token_address", "signal_type", "timestamp");
