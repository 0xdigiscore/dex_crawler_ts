/*
  Warnings:

  - A unique constraint covering the columns `[source,chain,token_address,signal_type]` on the table `GmgnSignal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `GmgnSignal` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_first` on table `GmgnSignal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "GmgnSignal_source_chain_token_address_timestamp_idx";

-- AlterTable
ALTER TABLE "GmgnSignal" ADD COLUMN     "last_occurrence" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "occurrence_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "is_first" SET NOT NULL,
ALTER COLUMN "is_first" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "GmgnSignal_last_occurrence_idx" ON "GmgnSignal"("last_occurrence");

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_source_chain_token_address_signal_type_key" ON "GmgnSignal"("source", "chain", "token_address", "signal_type");
