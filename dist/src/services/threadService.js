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
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("@/libs/consts");
const error_1 = require("@/libs/error");
const models_1 = require("@/models");
const threadSelect_1 = require("@/query/select/threadSelect");
const prismaClient_1 = require("@/libs/prismaClient");
const omitProperties_1 = require("@/utils/omitProperties");
class ThreadService {
    static findAll(_a, userId_1) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 20, offset = 0 }, userId) {
            const [threads, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Thread.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                    select: (0, threadSelect_1.threadSelectWithFilterCount)(userId),
                }),
                models_1.Thread.count(),
            ]);
            return [threads.map((thread) => this.format(thread)), count];
        });
    }
    static find(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const thread = yield models_1.Thread.findUnique({
                where: { id },
                select: (0, threadSelect_1.threadSelectWithFilterCount)(userId),
            });
            if (!thread)
                throw new error_1.NotFoundError(consts_1.ERROR_MESSAGE.threadNotFound);
            return this.format(thread);
        });
    }
    static findByUserId(userId_1, _a, loggedUserId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, { limit, offset }, loggedUserId) {
            const where = { authorId: userId };
            const [threads, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Thread.findMany({
                    skip: offset,
                    take: limit,
                    where,
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                    select: (0, threadSelect_1.threadSelectWithFilterCount)(loggedUserId),
                }),
                models_1.Thread.count({ where }),
            ]);
            return [threads.map((thread) => this.format(thread)), count];
        });
    }
    static findLikedByUserId(userId_1, _a, loggedUserId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, { offset, limit }, loggedUserId) {
            const where = { userId };
            const [users, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Likes.findMany({
                    where,
                    skip: offset,
                    select: {
                        thread: { select: (0, threadSelect_1.threadSelectWithFilterCount)(loggedUserId) },
                    },
                    take: limit,
                    orderBy: [{ createdAt: "desc" }, { userId: "desc" }],
                }),
                models_1.Likes.count({ where }),
            ]);
            return [
                users.map((reply) => (Object.assign({}, (0, omitProperties_1.omitProperties)(reply.thread, ["likes"])))),
                count,
            ];
        });
    }
    static search(q_1, _a, loggedUserId_1) {
        return __awaiter(this, arguments, void 0, function* (q, { limit, offset }, loggedUserId) {
            const where = {
                content: { contains: q, mode: "insensitive" },
            };
            const [threads, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Thread.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                    where,
                    select: (0, threadSelect_1.threadSelectWithFilterCount)(loggedUserId),
                }),
                models_1.Thread.count({ where }),
            ]);
            return [threads.map((thread) => this.format(thread)), count];
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Thread.create({ data: Object.assign({}, data), select: threadSelect_1.threadSelect });
        });
    }
    static update(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.find(id);
            return yield models_1.Thread.update({
                data: Object.assign({}, newData),
                where: { id },
                select: threadSelect_1.threadSelect,
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.find(id);
            return yield models_1.Thread.delete({ where: { id }, select: threadSelect_1.threadSelect });
        });
    }
    static format(threadPayload) {
        var _a, _b;
        return Object.assign(Object.assign({}, (0, omitProperties_1.omitProperties)(threadPayload, ["likes"])), { isLiked: ((_b = (_a = threadPayload.likes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.userId) ? true : false });
    }
}
exports.default = ThreadService;
//# sourceMappingURL=threadService.js.map