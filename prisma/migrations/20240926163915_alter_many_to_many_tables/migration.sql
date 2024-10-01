/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `role_permission` table. All the data in the column will be lost.
  - The primary key for the `user_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_id_fkey";

-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id", "permission_id");

-- AlterTable
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
