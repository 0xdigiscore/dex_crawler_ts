-- AlterTable
ALTER TABLE "GmgnSignal" ADD COLUMN     "raw_data" JSONB,
ADD COLUMN     "source" VARCHAR(255) NOT NULL DEFAULT 'gmgn_web';
