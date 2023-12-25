-- DropForeignKey
ALTER TABLE "cottage" DROP CONSTRAINT "cottage_place_id_fkey";

-- DropForeignKey
ALTER TABLE "cottage" DROP CONSTRAINT "cottage_region_id_fkey";

-- DropForeignKey
ALTER TABLE "cottage_image" DROP CONSTRAINT "cottage_image_cottage_id_fkey";

-- AddForeignKey
ALTER TABLE "cottage_image" ADD CONSTRAINT "cottage_image_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
