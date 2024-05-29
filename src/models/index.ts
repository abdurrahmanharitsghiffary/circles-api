import { prismaClient } from "../libs/prismaClient";

export const {
  user: User,
  reply: Reply,
  likes: Likes,
  thread: Thread,
  followings: Followings,
  $transaction,
} = prismaClient;
