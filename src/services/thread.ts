import { ERROR_MESSAGE } from "@/libs/consts";
import { NotFoundError } from "@/libs/error";
import { Likes, Thread } from "@/models";
import { PaginationBase } from "@/types/pagination";
import { ThreadCreateDTO, ThreadUpdateDTO } from "@/types/thread-dto";
import {
  ThreadSelectWithFilterCount,
  ThreadSelectPayload as ThreadT,
  threadSelect,
  threadSelectWithFilterCount,
} from "@/query/select/threadSelect";
import { prisma } from "@/libs/prismaClient";
import { omitProperties } from "@/utils/omitProperties";
import { Prisma } from "@prisma/client";

class ThreadService {
  static async findAll(
    { limit = 20, offset = 0 }: PaginationBase,
    userId?: number
  ) {
    const [threads, count] = await prisma.$transaction([
      Thread.findMany({
        skip: offset,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        select: threadSelectWithFilterCount(userId),
      }),
      Thread.count(),
    ]);
    console.log(threads, "THREADS");
    const formattedThreads = await Promise.all(
      threads.map(async (thread) => await this.format(thread))
    );

    return [formattedThreads, count] as const;
  }

  static async find(id: ThreadT["id"], userId?: number) {
    console.log(userId, "USER ID");
    const thread = await Thread.findUnique({
      where: { id },
      select: threadSelectWithFilterCount(userId),
    });
    console.log(thread, "THREAD");
    if (!thread) throw new NotFoundError(ERROR_MESSAGE.threadNotFound);
    return await this.format(thread);
  }

  static async findByUserId(
    userId: number,
    { limit, offset }: PaginationBase,
    loggedUserId?: number
  ) {
    const where = { authorId: userId } satisfies Prisma.ThreadWhereInput;
    const [threads, count] = await prisma.$transaction([
      Thread.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: [{ createdAt: "desc" }],
        select: threadSelectWithFilterCount(loggedUserId),
      }),
      Thread.count({ where }),
    ]);

    const formattedThreads = await Promise.all(
      threads.map(async (thread) => await this.format(thread))
    );

    return [formattedThreads, count] as const;
  }

  static async findLikedByUserId(
    userId: number,
    { offset, limit }: PaginationBase,
    loggedUserId?: number
  ) {
    const where = { userId } satisfies Prisma.LikesWhereInput;
    const [users, count] = await prisma.$transaction([
      Likes.findMany({
        where,
        skip: offset,
        select: {
          thread: { select: threadSelectWithFilterCount(loggedUserId) },
        },
        take: limit,
        orderBy: [{ createdAt: "desc" }],
      }),
      Likes.count({ where }),
    ]);

    return [
      users.map((reply) => ({ ...omitProperties(reply.thread, ["likes"]) })),
      count,
    ] as const;
  }

  static async create(data: ThreadCreateDTO) {
    return await Thread.create({ data: { ...data }, select: threadSelect });
  }

  static async update(id: ThreadT["id"], newData: ThreadUpdateDTO) {
    await this.find(id);
    return await Thread.update({
      data: { ...newData },
      where: { id },
      select: threadSelect,
    });
  }

  static async delete(id: ThreadT["id"]) {
    await this.find(id);
    return await Thread.delete({ where: { id }, select: threadSelect });
  }

  static async format(
    threadPayload: ThreadSelectWithFilterCount
  ): Promise<ThreadT & { isLiked: boolean }> {
    return {
      ...omitProperties(threadPayload, ["likes"]),
      isLiked: threadPayload.likes?.[0]?.userId ? true : false,
    };
  }
}

export default ThreadService;
