import { ERROR_MESSAGE } from "@/libs/consts";
import { NotFoundError } from "@/libs/error";
import { Likes, Thread } from "@/models";
import { PaginationBase } from "@/types/pagination";
import {
  ThreadSelectWithFilterCount,
  ThreadSelectPayload as ThreadT,
  threadSelect,
  threadSelectWithFilterCount,
} from "@/query/select/threadSelect";
import { prisma } from "@/libs/prismaClient";
import { omitProperties } from "@/utils/omitProperties";
import { Prisma } from "@prisma/client";
import { CreateThreadOptions, UpdateThreadOptions } from "@/types/threadDto";

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

    const formattedThreads = await Promise.all(
      threads.map(async (thread) => await this.format(thread))
    );

    return [formattedThreads, count] as const;
  }

  static async find(id: ThreadT["id"], userId?: number) {
    const thread = await Thread.findUnique({
      where: { id },
      select: threadSelectWithFilterCount(userId),
    });

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

  static async search(
    q: string,
    { limit, offset }: PaginationBase,
    loggedUserId?: number
  ) {
    const where = {
      content: { contains: q, mode: "insensitive" },
    } satisfies Prisma.ThreadWhereInput;
    const [threads, count] = await prisma.$transaction([
      Thread.findMany({
        skip: offset,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        where,
        select: threadSelectWithFilterCount(loggedUserId),
      }),
      Thread.count({ where }),
    ]);
    const formattedThreads = await Promise.all(
      threads.map(async (thread) => await this.format(thread))
    );

    return [formattedThreads, count] as const;
  }

  static async create(data: CreateThreadOptions) {
    return await Thread.create({ data: { ...data }, select: threadSelect });
  }

  static async update(id: ThreadT["id"], newData: UpdateThreadOptions) {
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
