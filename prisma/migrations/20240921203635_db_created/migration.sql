-- AlterTable
ALTER TABLE "user_device" ALTER COLUMN "last_login" DROP NOT NULL,
ALTER COLUMN "token_expire_at" DROP NOT NULL;
