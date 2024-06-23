import { Prisma, Reply as ReplyT } from "@prisma/client";
import { Reply } from "@/models";
import { CreateReplyOptions, UpdateReplyOptions } from "@/types/replyDto";
import {
  ReplySelectWithFilterCount,
  replySelect,
  replySelectWithFilterCount,
} from "@/query/select/replySelect";
import { NotFoundError } from "@/libs/error";
import { ERROR_MESSAGE } from "@/libs/consts";
import { PaginationBase } from "@/types/pagination";
import { prisma } from "@/libs/prismaClient";
import ThreadService from "./thread";
import { omitProperties } from "@/utils/omitProperties";

export class ReplyService {
  static async findAll(
    threadId: number,
    { limit, offset }: PaginationBase,
    userId?: number
  ) {
    const where = {
      threadId,
      parentId: null as null,
    } satisfies Prisma.ReplyWhereInput;
    const [replies, count] = await prisma.$transaction([
      Reply.findMany({
        where,
        skip: offset,
        take: limit,
        select: replySelectWithFilterCount(userId),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
      Reply.count({ where }),
    ]);
    return [replies.map((reply) => this.format(reply)), count] as const;
  }

  static async findAllByParent(
    parentId: number,
    { limit, offset }: PaginationBase,
    userId?: number
  ) {
    const where = { parentId } satisfies Prisma.ReplyWhereInput;
    const [replies, count] = await prisma.$transaction([
      Reply.findMany({
        where,
        skip: offset,
        take: limit,
        select: replySelectWithFilterCount(userId),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
      Reply.count({ where }),
    ]);

    return [replies.map((reply) => this.format(reply)), count] as const;
  }
  static async find(id: number, userId?: number) {
    const reply = await Reply.findUnique({
      where: { id },
      select: replySelectWithFilterCount(userId),
    });
    if (!reply) throw new NotFoundError(ERROR_MESSAGE.replyNotFound);
    return this.format(reply);
  }

  static async findByUserId(userId: number, { limit, offset }: PaginationBase) {
    const where = { authorId: userId } satisfies Prisma.ReplyWhereInput;
    const [replies, count] = await prisma.$transaction([
      Reply.findMany({
        where,
        skip: offset,
        take: limit,
        select: replySelectWithFilterCount(userId),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
      Reply.count({ where }),
    ]);

    return [replies.map((reply) => this.format(reply)), count] as const;
  }

  static async create(dto: CreateReplyOptions) {
    await ThreadService.find(dto.threadId);
    if (dto?.parentId) await this.find(dto?.parentId);
    return await Reply.create({ data: { ...dto }, select: replySelect });
  }

  static async update(id: ReplyT["id"], dto: UpdateReplyOptions) {
    await this.find(id);
    return await Reply.update({
      data: { ...dto },
      where: { id },
      select: replySelect,
    });
  }

  static async delete(id: ReplyT["id"]) {
    await this.find(id);
    return await Reply.delete({ where: { id }, select: replySelect });
  }

  static format(
    replyPayload: ReplySelectWithFilterCount
  ): Omit<ReplyT, "authorId"> & { isLiked: boolean } {
    return {
      ...omitProperties(replyPayload, ["likes"]),
      isLiked: replyPayload.likes?.[0]?.userId ? true : false,
    };
  }
}
