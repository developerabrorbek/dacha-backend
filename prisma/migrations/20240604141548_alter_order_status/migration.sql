/*
  Warnings:

  - The `tariff_status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('cancelled', 'progress', 'success');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tariff_status",
ADD COLUMN     "tariff_status" "OrderStatus" NOT NULL DEFAULT 'progress';

-- DropEnum
DROP TYPE "CottageOnTariffStatus";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
