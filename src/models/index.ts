import { prisma } from "@/libs/prismaClient";

export const {
  user: User,
  reply: Reply,
  likes: Likes,
  thread: Thread,
  followings: Followings,
  refreshToken: RefreshToken,
} = prisma;
