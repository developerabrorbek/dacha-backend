/*
  Warnings:

  - The `main_image` column on the `cottage_image` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cottage_image" DROP COLUMN "main_image",
ADD COLUMN     "main_image" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "MainImage";
