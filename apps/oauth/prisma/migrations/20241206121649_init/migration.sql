-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('PUBLIC', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('CREATED', 'PENDING', 'COMFIRMED', 'BLOCKED', 'REMOVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pin_code" TEXT,
    "roles" "AccountRole"[] DEFAULT ARRAY['PUBLIC']::"AccountRole"[],
    "status" "AccountStatus" NOT NULL DEFAULT 'CREATED',
    "meta" JSON,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "account_id" TEXT NOT NULL,
    "expire_at" DATE NOT NULL,
    "meta" JSON,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
