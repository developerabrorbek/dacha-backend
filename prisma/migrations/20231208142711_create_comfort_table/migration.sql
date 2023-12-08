-- CreateTable
CREATE TABLE "comfort" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,
    "image" VARCHAR NOT NULL,

    CONSTRAINT "comfort_pkey" PRIMARY KEY ("id")
);
