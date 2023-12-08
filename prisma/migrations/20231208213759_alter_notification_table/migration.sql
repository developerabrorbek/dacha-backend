/*
  Warnings:

  - Added the required column `created_by` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "created_by" UUID NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;
