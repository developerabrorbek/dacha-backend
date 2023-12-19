/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "image" VARCHAR,
ADD COLUMN     "sms_code" VARCHAR,
ADD COLUMN     "sms_time" VARCHAR,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");
