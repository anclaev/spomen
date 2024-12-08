/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `oauth_clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `oauth_clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `oauth_clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oauth_clients" ADD COLUMN     "domain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_name_key" ON "oauth_clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_domain_key" ON "oauth_clients"("domain");
