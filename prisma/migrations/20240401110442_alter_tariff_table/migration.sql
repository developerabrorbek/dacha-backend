-- DropForeignKey
ALTER TABLE "tariff" DROP CONSTRAINT "tariff_service_id_fkey";

-- AddForeignKey
ALTER TABLE "tariff" ADD CONSTRAINT "tariff_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
