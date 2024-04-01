/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "service" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,
    "description" UUID NOT NULL,
    "images" VARCHAR[],
    "service_code" "ServiceCode" NOT NULL DEFAULT 'recommended',

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "type" UUID NOT NULL,
    "price" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "description" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "tariff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tariff" ADD CONSTRAINT "tariff_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
