/*
  Warnings:

  - The values [personal,public] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `comforts` on the `cottage` table. All the data in the column will be lost.
  - You are about to drop the column `cottage_type` on the `cottage` table. All the data in the column will be lost.
  - You are about to drop the column `lattitude` on the `cottage` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `cottage` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(3,2)`.
  - You are about to drop the column `created_by` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `watched_users` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `sms_code` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `sms_time` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `user_device` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `user_device` table. All the data in the column will be lost.
  - You are about to drop the `UserOnRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `cottage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expire_at` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_login` to the `user_device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_expire_at` to the `user_device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('message', 'alert', 'reminder', 'system');
ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'message';
COMMIT;

-- DropForeignKey
ALTER TABLE "UserOnRole" DROP CONSTRAINT "UserOnRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserOnRole" DROP CONSTRAINT "UserOnRole_user_id_fkey";

-- AlterTable
ALTER TABLE "cottage" DROP COLUMN "comforts",
DROP COLUMN "cottage_type",
DROP COLUMN "lattitude",
ADD COLUMN     "is_test" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" VARCHAR,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 4.1,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2);

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "created_by",
DROP COLUMN "status",
DROP COLUMN "user_id",
DROP COLUMN "watched_users",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" SET DEFAULT 'message';

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "assigned_at",
DROP COLUMN "end_time",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expire_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "permissions",
ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "service" ALTER COLUMN "service_code" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "balance",
DROP COLUMN "sms_code",
DROP COLUMN "sms_time";

-- AlterTable
ALTER TABLE "user_device" DROP COLUMN "ip",
DROP COLUMN "user_agent",
ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "device_id" VARCHAR,
ADD COLUMN     "device_name" VARCHAR,
ADD COLUMN     "device_type" VARCHAR,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" DATE NOT NULL,
ADD COLUMN     "platform" VARCHAR,
ADD COLUMN     "token_expire_at" DATE NOT NULL,
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "access_token" DROP NOT NULL;

-- DropTable
DROP TABLE "UserOnRole";

-- DropEnum
DROP TYPE "NotificationStatus";

-- CreateTable
CREATE TABLE "cottage_cottagetype" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "cottage_id" UUID NOT NULL,
    "cottage_type_id" UUID NOT NULL,

    CONSTRAINT "cottage_cottagetype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cottage_comfort" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "cottage_id" UUID NOT NULL,
    "comfort_id" UUID NOT NULL,

    CONSTRAINT "cottage_comfort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_cottage" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "priority" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" DATE NOT NULL,
    "service_code" "ServiceCode" NOT NULL,
    "cottage_id" UUID NOT NULL,

    CONSTRAINT "premium_cottage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "notification_id" UUID NOT NULL,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_otp" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "otp" VARCHAR(6) NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATE NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cottage_cottagetype" ADD CONSTRAINT "cottage_cottagetype_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage_cottagetype" ADD CONSTRAINT "cottage_cottagetype_cottage_type_id_fkey" FOREIGN KEY ("cottage_type_id") REFERENCES "cottage_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage_comfort" ADD CONSTRAINT "cottage_comfort_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage_comfort" ADD CONSTRAINT "cottage_comfort_comfort_id_fkey" FOREIGN KEY ("comfort_id") REFERENCES "comfort"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cottage" ADD CONSTRAINT "cottage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "premium_cottage" ADD CONSTRAINT "premium_cottage_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_otp" ADD CONSTRAINT "user_otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
