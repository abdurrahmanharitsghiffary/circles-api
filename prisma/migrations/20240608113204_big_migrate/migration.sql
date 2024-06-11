/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `isInvalid` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `userAgentId` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the `Followings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_agents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `replies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_followedId_fkey";

-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_userAgentId_fkey";

-- DropIndex
DROP INDEX "refresh_token_userAgentId_key";

-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "expiredAt",
DROP COLUMN "isInvalid",
DROP COLUMN "userAgentId",
ADD COLUMN     "expiresAt" INTEGER NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "images",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "Followings";

-- DropTable
DROP TABLE "Likes";

-- DropTable
DROP TABLE "user_agents";

-- CreateTable
CREATE TABLE "followings" (
    "followerId" INTEGER NOT NULL,
    "followedId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "followings_pkey" PRIMARY KEY ("followerId","followedId")
);

-- CreateTable
CREATE TABLE "likes" (
    "userId" INTEGER NOT NULL,
    "threadId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("userId","threadId")
);

-- CreateTable
CREATE TABLE "reply_likes" (
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reply_likes_pkey" PRIMARY KEY ("userId","replyId")
);

-- AddForeignKey
ALTER TABLE "followings" ADD CONSTRAINT "followings_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followings" ADD CONSTRAINT "followings_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply_likes" ADD CONSTRAINT "reply_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply_likes" ADD CONSTRAINT "reply_likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
