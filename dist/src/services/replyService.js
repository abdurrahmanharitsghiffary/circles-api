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
exports.ReplyService = void 0;
const models_1 = require("@/models");
const replySelect_1 = require("@/query/select/replySelect");
const error_1 = require("@/libs/error");
const consts_1 = require("@/libs/consts");
const prismaClient_1 = require("@/libs/prismaClient");
const threadService_1 = __importDefault(require("./threadService"));
const omitProperties_1 = require("@/utils/omitProperties");
class ReplyService {
    static findAll(threadId_1, _a, userId_1) {
        return __awaiter(this, arguments, void 0, function* (threadId, { limit, offset }, userId) {
            const where = {
                threadId,
                parentId: null,
            };
            const [replies, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Reply.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    select: (0, replySelect_1.replySelectWithFilterCount)(userId),
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                }),
                models_1.Reply.count({ where }),
            ]);
            return [replies.map((reply) => this.format(reply)), count];
        });
    }
    static findAllByParent(parentId_1, _a, userId_1) {
        return __awaiter(this, arguments, void 0, function* (parentId, { limit, offset }, userId) {
            const where = { parentId };
            const [replies, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Reply.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    select: (0, replySelect_1.replySelectWithFilterCount)(userId),
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                }),
                models_1.Reply.count({ where }),
            ]);
            return [replies.map((reply) => this.format(reply)), count];
        });
    }
    static find(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield models_1.Reply.findUnique({
                where: { id },
                select: (0, replySelect_1.replySelectWithFilterCount)(userId),
            });
            if (!reply)
                throw new error_1.NotFoundError(consts_1.ERROR_MESSAGE.replyNotFound);
            return this.format(reply);
        });
    }
    static findByUserId(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { limit, offset }) {
            const where = { authorId: userId };
            const [replies, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Reply.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    select: (0, replySelect_1.replySelectWithFilterCount)(userId),
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                }),
                models_1.Reply.count({ where }),
            ]);
            return [replies.map((reply) => this.format(reply)), count];
        });
    }
    static create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield threadService_1.default.find(dto.threadId);
            if (dto === null || dto === void 0 ? void 0 : dto.parentId)
                yield this.find(dto === null || dto === void 0 ? void 0 : dto.parentId);
            return yield models_1.Reply.create({ data: Object.assign({}, dto), select: replySelect_1.replySelect });
        });
    }
    static update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.find(id);
            return yield models_1.Reply.update({
                data: Object.assign({}, dto),
                where: { id },
                select: replySelect_1.replySelect,
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.find(id);
            return yield models_1.Reply.delete({ where: { id }, select: replySelect_1.replySelect });
        });
    }
    static format(replyPayload) {
        var _a, _b;
        return Object.assign(Object.assign({}, (0, omitProperties_1.omitProperties)(replyPayload, ["likes"])), { isLiked: ((_b = (_a = replyPayload.likes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.userId) ? true : false });
    }
}
exports.ReplyService = ReplyService;
//# sourceMappingURL=replyService.js.map