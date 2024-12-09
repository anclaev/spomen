-- AlterTable
ALTER TABLE "oauth_clients" ADD COLUMN     "redirect_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
