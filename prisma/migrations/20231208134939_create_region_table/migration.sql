-- CreateEnum
CREATE TYPE "CottageType" AS ENUM ('cottage', 'picnic', 'fishing');

-- CreateEnum
CREATE TYPE "MainImage" AS ENUM ('true', 'false');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('new', 'seen');

-- CreateEnum
CREATE TYPE "CottageStatus" AS ENUM ('progress', 'confirmed', 'rejected');

-- AlterTable
ALTER TABLE "translate" ALTER COLUMN "status" SET DEFAULT 'inactive';

-- CreateTable
CREATE TABLE "region" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" UUID NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);
