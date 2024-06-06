import { Prisma } from "@prisma/client";

export const userBaseSelect = {
  id: true,
  bio: true,
  firstName: true,
  lastName: true,
  coverPicture: true,
  photoProfile: true,
  username: true,
  _count: { select: { followers: true, following: true } },
} satisfies Prisma.UserSelect;

export type UserBaseSelectPayload = Prisma.UserGetPayload<{
  select: typeof userBaseSelect;
}>;

export const userSelect = {
  ...userBaseSelect,
  email: true,
  password: true,
  role: true,
} satisfies Prisma.UserSelect;

export type UserSelectPayload = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export const userSelectWithFilterCount = (userId?: number) =>
  ({
    ...userBaseSelect,
    followers: {
      select: { followerId: true },
      where: { followerId: userId },
      take: 1,
    },
  } satisfies Prisma.UserSelect);

export type UserSelectWithFilterCountPayload = Prisma.UserGetPayload<{
  select: ReturnType<typeof userSelectWithFilterCount>;
}>;
