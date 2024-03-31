-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,
    "description" UUID NOT NULL,
    "images" VARCHAR[],

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
