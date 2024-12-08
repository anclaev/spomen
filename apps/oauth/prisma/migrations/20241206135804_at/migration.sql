/*
  Warnings:

  - You are about to drop the column `password_updated_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expire_at` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "password_updated_at";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expire_at";
