/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `ipv4` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `ipv6` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `threads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userAgentId]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiredAt` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgentId` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "expiresAt",
DROP COLUMN "ipv4",
DROP COLUMN "ipv6",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isInvalid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "threads" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_agents" (
    "id" SERIAL NOT NULL,
    "deviceModel" TEXT,
    "deviceVendor" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_agents_ip_key" ON "user_agents"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_userAgentId_key" ON "refresh_token"("userAgentId");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userAgentId_fkey" FOREIGN KEY ("userAgentId") REFERENCES "user_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
