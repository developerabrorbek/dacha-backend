/*
  Warnings:

  - You are about to drop the column `booked_time` on the `cottage` table. All the data in the column will be lost.
  - You are about to drop the column `is_recommended` on the `cottage` table. All the data in the column will be lost.
  - You are about to drop the column `is_top` on the `cottage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CottageOnTariffStatus" AS ENUM ('cancelled', 'progress', 'success');

-- AlterTable
ALTER TABLE "CottageOnTariff" ADD COLUMN     "tariff_status" "CottageOnTariffStatus" NOT NULL DEFAULT 'progress',
ALTER COLUMN "status" SET DEFAULT 'inactive';

-- AlterTable
ALTER TABLE "cottage" DROP COLUMN "booked_time",
DROP COLUMN "is_recommended",
DROP COLUMN "is_top";
