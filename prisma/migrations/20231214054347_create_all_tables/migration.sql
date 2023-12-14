/*
  Warnings:

  - You are about to drop the `_ComfortsOnCottages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lattitude` to the `cottage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `cottage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `cottage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ComfortsOnCottages" DROP CONSTRAINT "_ComfortsOnCottages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComfortsOnCottages" DROP CONSTRAINT "_ComfortsOnCottages_B_fkey";

-- AlterTable
ALTER TABLE "cottage" ADD COLUMN     "booked_time" VARCHAR[],
ADD COLUMN     "comforts" UUID[],
ADD COLUMN     "lattitude" VARCHAR NOT NULL,
ADD COLUMN     "longitude" VARCHAR NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "watched_users" UUID[];

-- DropTable
DROP TABLE "_ComfortsOnCottages";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "balance" DOUBLE PRECISION,
    "favorite_cottages" UUID[],
    "password" VARCHAR,
    "username" VARCHAR,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_device" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "user_agent" VARCHAR,
    "ip" VARCHAR,
    "refresh_token" VARCHAR NOT NULL,
    "access_token" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_device" ADD CONSTRAINT "user_device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
