import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prismaClient";
import { ReplyLikes } from "@/models";
import { userSelectWithFilterCount } from "@/query/select/userSelect";
import { PaginationBase } from "@/types/pagination";
import UserService from "./userService";

export class ReplyLikeService {
  static async findAll(
    replyId: number,
    { limit, offset }: PaginationBase,
    userId?: number
  ) {
    const where = { replyId } satisfies Prisma.ReplyLikesWhereInput;
    const [users, count] = await prisma.$transaction([
      ReplyLikes.findMany({
        where,
        skip: offset,
        select: {
          user: { select: userSelectWithFilterCount(userId) },
          createdAt: true,
          updatedAt: true,
        },
        take: limit,
        orderBy: [{ createdAt: "desc" }, { userId: "desc" }],
      }),
      ReplyLikes.count({ where }),
    ]);

    return [
      users.map((reply) => ({
        ...UserService.format(reply.user),
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      })),
      count,
    ] as const;
  }

  static async isLiked(userId: number, replyId: number) {
    const like = await ReplyLikes.count({
      where: { replyId, userId },
    });
    return like === 0 ? false : true;
  }

  static async create(userId: number, replyId: number) {
    const like = await this.isLiked(userId, replyId);
    if (like) return false;
    await ReplyLikes.create({ data: { replyId, userId } });
    return true;
  }

  static async delete(userId: number, replyId: number) {
    const like = await this.isLiked(userId, replyId);
    if (!like) return false;
    await ReplyLikes.delete({
      where: { userId_replyId: { userId, replyId } },
    });
    return true;
  }
}
