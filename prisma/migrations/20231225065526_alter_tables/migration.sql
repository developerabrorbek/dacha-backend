-- DropForeignKey
ALTER TABLE "cottage" DROP CONSTRAINT "cottage_place_id_fkey";

-- DropForeignKey
ALTER TABLE "cottage" DROP CONSTRAINT "cottage_region_id_fkey";

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
