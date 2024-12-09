/*
  Warnings:

  - You are about to drop the column `scopes` on the `oauth_clients` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OAuthClientGrantType" AS ENUM ('AuthorizationCode', 'ClientCredentials', 'Implicit', 'RefreshToken', 'Password');

-- AlterTable
ALTER TABLE "oauth_clients" DROP COLUMN "scopes",
ADD COLUMN     "grants" "OAuthClientGrantType"[] DEFAULT ARRAY['AuthorizationCode', 'RefreshToken']::"OAuthClientGrantType"[];
