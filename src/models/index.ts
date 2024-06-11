import { prisma } from "@/libs/prismaClient";

export const User = prisma.user;
export const Reply = prisma.reply;
export const Likes = prisma.likes;
export const Thread = prisma.thread;
export const Followings = prisma.followings;
export const RefreshToken = prisma.refreshToken;
export const Token = prisma.token;
export const ReplyLikes = prisma.replyLikes;
