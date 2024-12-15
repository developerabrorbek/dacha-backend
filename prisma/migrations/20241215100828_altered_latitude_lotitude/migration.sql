/*
  Warnings:

  - The `longitude` column on the `cottage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `latitude` column on the `cottage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cottage" DROP COLUMN "longitude",
ADD COLUMN     "longitude" DOUBLE PRECISION,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DOUBLE PRECISION;
