"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyLikeService = void 0;
const prismaClient_1 = require("@/libs/prismaClient");
const models_1 = require("@/models");
const userSelect_1 = require("@/query/select/userSelect");
const userService_1 = __importDefault(require("./userService"));
class ReplyLikeService {
    static findAll(replyId_1, _a, userId_1) {
        return __awaiter(this, arguments, void 0, function* (replyId, { limit, offset }, userId) {
            const where = { replyId };
            const [users, count] = yield prismaClient_1.prisma.$transaction([
                models_1.ReplyLikes.findMany({
                    where,
                    skip: offset,
                    select: {
                        user: { select: (0, userSelect_1.userSelectWithFilterCount)(userId) },
                        createdAt: true,
                        updatedAt: true,
                    },
                    take: limit,
                    orderBy: [{ createdAt: "desc" }, { userId: "desc" }],
                }),
                models_1.ReplyLikes.count({ where }),
            ]);
            return [
                users.map((reply) => (Object.assign(Object.assign({}, userService_1.default.format(reply.user)), { createdAt: reply.createdAt, updatedAt: reply.updatedAt }))),
                count,
            ];
        });
    }
    static isLiked(userId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield models_1.ReplyLikes.count({
                where: { replyId, userId },
            });
            return like === 0 ? false : true;
        });
    }
    static create(userId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.isLiked(userId, replyId);
            if (like)
                return false;
            yield models_1.ReplyLikes.create({ data: { replyId, userId } });
            return true;
        });
    }
    static delete(userId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.isLiked(userId, replyId);
            if (!like)
                return false;
            yield models_1.ReplyLikes.delete({
                where: { userId_replyId: { userId, replyId } },
            });
            return true;
        });
    }
}
exports.ReplyLikeService = ReplyLikeService;
//# sourceMappingURL=replyLikeService.js.map