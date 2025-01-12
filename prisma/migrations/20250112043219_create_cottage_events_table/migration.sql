-- CreateEnum
CREATE TYPE "CottageEventType" AS ENUM ('call', 'view');

-- CreateTable
CREATE TABLE "Cottage_Event" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "occurred_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" "CottageEventType" NOT NULL,
    "cottage_id" UUID NOT NULL,

    CONSTRAINT "Cottage_Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cottage_Event_cottage_id_idx" ON "Cottage_Event"("cottage_id");

-- AddForeignKey
ALTER TABLE "Cottage_Event" ADD CONSTRAINT "Cottage_Event_cottage_id_fkey" FOREIGN KEY ("cottage_id") REFERENCES "cottage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
