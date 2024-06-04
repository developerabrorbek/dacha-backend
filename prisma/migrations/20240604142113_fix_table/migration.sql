/*
  Warnings:

  - You are about to drop the column `tariff_status` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tariff_status",
ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'progress';
