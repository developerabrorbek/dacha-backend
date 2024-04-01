-- CreateTable
CREATE TABLE "CottageOnTariff" (
    "cottage_id" UUID NOT NULL,
    "tariff_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "assigned_by" UUID NOT NULL,

    CONSTRAINT "CottageOnTariff_pkey" PRIMARY KEY ("cottage_id","tariff_id")
);

-- AddForeignKey
ALTER TABLE "CottageOnTariff" ADD CONSTRAINT "CottageOnTariff_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CottageOnTariff" ADD CONSTRAINT "CottageOnTariff_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
