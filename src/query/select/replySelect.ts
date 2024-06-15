import { Prisma } from "@prisma/client";
import { userBaseSelect } from "./userSelect";

export const replySelect = {
  author: { select: userBaseSelect },
  content: true,
  createdAt: true,
  id: true,
  image: true,
  parentId: true,
  threadId: true,
  updatedAt: true,
  _count: { select: { likes: true, replies: true } },
} satisfies Prisma.ReplySelect;

export type ReplySelectPayload = Prisma.ReplyGetPayload<{
  select: typeof replySelect;
}>;

export const replySelectWithFilterCount = (userId: number) =>
  ({
    ...replySelect,
    likes: {
      where: { userId: userId || -1 },
      select: { userId: true },
      take: 1,
    },
  } satisfies Prisma.ReplySelect);

export type ReplySelectWithFilterCount = Prisma.ReplyGetPayload<{
  select: ReturnType<typeof replySelectWithFilterCount>;
}>;
