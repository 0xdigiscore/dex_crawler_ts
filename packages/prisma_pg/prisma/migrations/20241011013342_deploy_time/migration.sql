/*
  Warnings:

  - The `deploy_time` column on the `Token` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "deploy_time",
ADD COLUMN     "deploy_time" BIGINT;
