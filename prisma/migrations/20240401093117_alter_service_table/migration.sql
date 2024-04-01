-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "service_code" "ServiceCode" NOT NULL DEFAULT 'recommended';

-- AlterTable
ALTER TABLE "cottage" ADD COLUMN     "is_recommended" BOOLEAN NOT NULL DEFAULT false;
