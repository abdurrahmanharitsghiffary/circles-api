"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyLikes = exports.Token = exports.RefreshToken = exports.Followings = exports.Thread = exports.Likes = exports.Reply = exports.User = void 0;
const prismaClient_1 = require("@/libs/prismaClient");
exports.User = prismaClient_1.prisma.user;
exports.Reply = prismaClient_1.prisma.reply;
exports.Likes = prismaClient_1.prisma.likes;
exports.Thread = prismaClient_1.prisma.thread;
exports.Followings = prismaClient_1.prisma.followings;
exports.RefreshToken = prismaClient_1.prisma.refreshToken;
exports.Token = prismaClient_1.prisma.token;
exports.ReplyLikes = prismaClient_1.prisma.replyLikes;
//# sourceMappingURL=index.js.map