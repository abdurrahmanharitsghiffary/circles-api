/*
  Warnings:

  - The primary key for the `Followings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followedById` on the `Followings` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Followings` table. All the data in the column will be lost.
  - Added the required column `followedId` to the `Followings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerId` to the `Followings` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `threadId` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_followedById_fkey";

-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_authorId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_threadId_fkey";

-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_authorId_fkey";

-- AlterTable
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_pkey",
DROP COLUMN "followedById",
DROP COLUMN "followingId",
ADD COLUMN     "followedId" INTEGER NOT NULL,
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "Followings_pkey" PRIMARY KEY ("followerId", "followedId");

-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "threadId" SET NOT NULL;

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "authorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Followings" ADD CONSTRAINT "Followings_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followings" ADD CONSTRAINT "Followings_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
