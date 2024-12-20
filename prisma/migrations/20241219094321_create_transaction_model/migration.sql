-- CreateTable
CREATE TABLE "transactions" (
    "id" VARCHAR NOT NULL,
    "create_time" INTEGER NOT NULL,
    "perform_time" INTEGER NOT NULL DEFAULT 0,
    "cancel_time" INTEGER NOT NULL DEFAULT 0,
    "reason" INTEGER,
    "provider" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "order_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
