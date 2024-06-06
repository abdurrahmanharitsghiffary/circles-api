import { Prisma, Reply as ReplyT } from "@prisma/client";
import { Reply } from "@/models";
import { CreateReplyDTO, UpdateReplyDTO } from "@/types/reply-dto";
import { replySelect } from "@/query/select/replySelect";
import { NotFoundError } from "@/libs/error";
import { ERROR_MESSAGE } from "@/libs/consts";
import { PaginationBase } from "@/types/pagination";
import { prisma } from "@/libs/prismaClient";

export class ReplyService {
  static async findAll(threadId: number, { limit, offset }: PaginationBase) {
    const where = { threadId } satisfies Prisma.ReplyWhereInput;
    const [replies, count] = await prisma.$transaction([
      Reply.findMany({
        where,
        skip: offset,
        take: limit,
        select: replySelect,
        orderBy: [{ createdAt: "desc" }],
      }),
      Reply.count({ where }),
    ]);

    return [replies, count] as const;
  }

  static async find(id: number) {
    const reply = await Reply.findUnique({
      where: { id },
      select: replySelect,
    });
    if (!reply) throw new NotFoundError(ERROR_MESSAGE.replyNotFound);
    return reply;
  }

  static async findByUserId(userId: number, { limit, offset }: PaginationBase) {
    const where = { authorId: userId } satisfies Prisma.ReplyWhereInput;
    const [replies, count] = await prisma.$transaction([
      Reply.findMany({
        where,
        skip: offset,
        take: limit,
        select: replySelect,
        orderBy: [{ createdAt: "desc" }],
      }),
      Reply.count({ where }),
    ]);

    return [replies, count] as const;
  }

  static async create(dto: CreateReplyDTO) {
    await this.find(dto.threadId);
    return await Reply.create({ data: { ...dto }, select: replySelect });
  }

  static async update(id: ReplyT["id"], dto: UpdateReplyDTO) {
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
}
