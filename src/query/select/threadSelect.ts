import { Prisma } from "@prisma/client";
import { userBaseSelect } from "./userSelect";

export const threadSelect = {
  author: { select: userBaseSelect },
  content: true,
  createdAt: true,
  id: true,
  images: true,
  updatedAt: true,
  authorId: true,
  _count: { select: { likes: true, replies: true } },
} satisfies Prisma.ThreadSelect;

export type ThreadSelectPayload = Prisma.ThreadGetPayload<{
  select: typeof threadSelect;
}>;

export const threadSelectWithFilterCount = (userId: number) =>
  ({
    ...threadSelect,
    likes: { where: { userId }, select: { userId: true }, take: 1 },
  } satisfies Prisma.ThreadSelect);

export type ThreadSelectWithFilterCount = Prisma.ThreadGetPayload<{
  select: ReturnType<typeof threadSelectWithFilterCount>;
}>;
