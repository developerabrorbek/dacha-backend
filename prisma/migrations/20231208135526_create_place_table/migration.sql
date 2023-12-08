-- CreateTable
CREATE TABLE "place" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,
    "image" VARCHAR NOT NULL,
    "region_id" UUID NOT NULL,

    CONSTRAINT "place_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
