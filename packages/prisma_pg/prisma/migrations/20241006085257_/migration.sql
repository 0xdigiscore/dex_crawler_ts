/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `GmgnSignal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GmgnSignal" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "from_timestamp" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "updated_at" SET DATA TYPE DECIMAL(65,30);
DROP SEQUENCE "GmgnSignal_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "GmgnSignal_id_key" ON "GmgnSignal"("id");
