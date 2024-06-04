/*
  Warnings:

  - You are about to drop the `CottageOnTariff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CottageOnTariff" DROP CONSTRAINT "CottageOnTariff_cottage_id_fkey";

-- DropForeignKey
ALTER TABLE "CottageOnTariff" DROP CONSTRAINT "CottageOnTariff_tariff_id_fkey";

-- DropTable
DROP TABLE "CottageOnTariff";

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "cottage_id" UUID NOT NULL,
    "tariff_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'inactive',
    "tariff_status" "CottageOnTariffStatus" NOT NULL DEFAULT 'progress',
    "assigned_by" UUID NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
