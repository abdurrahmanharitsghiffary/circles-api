import { Prisma } from "@prisma/client";
import { userBaseSelect } from "./userSelect";

export const replySelect = {
  author: { select: userBaseSelect },
  authorId: true,
  content: true,
  createdAt: true,
  id: true,
  image: true,
  threadId: true,
  updatedAt: true,
  _count: { select: { likes: true, replies: true } },
} satisfies Prisma.ReplySelect;

export type ReplySelectPayload = Prisma.ReplyGetPayload<{
  select: typeof replySelect;
}>;
