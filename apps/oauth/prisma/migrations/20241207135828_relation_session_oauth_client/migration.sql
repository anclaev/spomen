/*
  Warnings:

  - Added the required column `client_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "client_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
