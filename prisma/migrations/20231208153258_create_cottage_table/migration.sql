/*
  Warnings:

  - Added the required column `cottage_id` to the `cottage_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cottage_image" ADD COLUMN     "cottage_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "cottage" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,
    "rating" REAL NOT NULL,
    "description" UUID NOT NULL,
    "cottage_type" "CottageType"[],
    "cottage_status" "CottageStatus" NOT NULL DEFAULT 'progress',
    "price" REAL NOT NULL,
    "price_weekend" REAL NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "region_id" UUID NOT NULL,
    "place_id" UUID NOT NULL,
    "images_id" UUID[],

    CONSTRAINT "cottage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ComfortsOnCottages" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComfortsOnCottages_AB_unique" ON "_ComfortsOnCottages"("A", "B");

-- CreateIndex
CREATE INDEX "_ComfortsOnCottages_B_index" ON "_ComfortsOnCottages"("B");

-- AddForeignKey
ALTER TABLE "cottage_image" ADD CONSTRAINT "cottage_image_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ComfortsOnCottages" ADD CONSTRAINT "_ComfortsOnCottages_A_fkey" FOREIGN KEY ("A") REFERENCES "comfort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComfortsOnCottages" ADD CONSTRAINT "_ComfortsOnCottages_B_fkey" FOREIGN KEY ("B") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
