-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('personal', 'public');

-- AlterTable
ALTER TABLE "cottage" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "cottage_image" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "message" VARCHAR NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'personal',
    "status" "NotificationStatus" NOT NULL DEFAULT 'new',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);
