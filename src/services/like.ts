import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prismaClient";
import { Likes } from "@/models";
import { userBaseSelect } from "@/query/select/userSelect";
import { PaginationBase } from "@/types/pagination";

export class LikeService {
  static async findAll(threadId: number, { limit, offset }: PaginationBase) {
    const where = { threadId } satisfies Prisma.LikesWhereInput;
    const [users, count] = await prisma.$transaction([
      Likes.findMany({
        where,
        skip: offset,
        select: {
          user: { select: userBaseSelect },
          createdAt: true,
          updatedAt: true,
        },
        take: limit,
        orderBy: [{ createdAt: "desc" }],
      }),
      Likes.count({ where }),
    ]);

    return [
      users.map((reply) => ({
        ...reply.user,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      })),
      count,
    ] as const;
  }

  static async isLiked(userId: number, threadId: number) {
    const like = await Likes.count({
      where: { threadId, userId },
    });
    return like === 0 ? false : true;
  }

  static async create(userId: number, threadId: number) {
    const like = await this.isLiked(userId, threadId);
    if (like) return false;
    await Likes.create({ data: { threadId, userId } });
    return true;
  }

  static async delete(userId: number, threadId: number) {
    const like = await this.isLiked(userId, threadId);
    if (!like) return false;
    await Likes.delete({
      where: { userId_threadId: { userId, threadId } },
    });
    return true;
  }
}
