/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('PUBLIC', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('CREATED', 'PENDING', 'CONFIRMED', 'LOCKED', 'MARKED', 'REMOVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "login" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passkey" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'CREATED',
    "roles" "AccountRole"[] DEFAULT ARRAY['PUBLIC']::"AccountRole"[],
    "meta" JSON,
    "first_name" TEXT,
    "last_name" TEXT,
    "birthday" DATE,
    "sex" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "owner_id" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" DATE NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_login_key" ON "accounts"("login");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
