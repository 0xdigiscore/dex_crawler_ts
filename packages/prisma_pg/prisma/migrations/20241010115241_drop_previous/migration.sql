/*
  Warnings:

  - You are about to drop the `_GmgnSignalPreviousSignals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GmgnSignalPreviousSignals" DROP CONSTRAINT "_GmgnSignalPreviousSignals_A_fkey";

-- DropForeignKey
ALTER TABLE "_GmgnSignalPreviousSignals" DROP CONSTRAINT "_GmgnSignalPreviousSignals_B_fkey";

-- DropTable
DROP TABLE "_GmgnSignalPreviousSignals";
