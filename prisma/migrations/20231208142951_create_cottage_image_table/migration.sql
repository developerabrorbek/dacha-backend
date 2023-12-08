-- CreateTable
CREATE TABLE "cottage_image" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "image" VARCHAR NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "main_image" "MainImage" NOT NULL DEFAULT 'false',

    CONSTRAINT "cottage_image_pkey" PRIMARY KEY ("id")
);
