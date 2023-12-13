/*
  Warnings:

  - The `cottage_type` column on the `cottage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cottage" DROP COLUMN "cottage_type",
ADD COLUMN     "cottage_type" TEXT[];

-- DropEnum
DROP TYPE "CottageType";

-- CreateTable
CREATE TABLE "cottage_type" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,

    CONSTRAINT "cottage_type_pkey" PRIMARY KEY ("id")
);
