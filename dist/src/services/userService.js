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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("@/libs/consts");
const error_1 = require("@/libs/error");
const models_1 = require("@/models");
const prismaClient_1 = require("@/libs/prismaClient");
const userSelect_1 = require("@/query/select/userSelect");
const hash_1 = require("@/libs/hash");
const omitProperties_1 = require("@/utils/omitProperties");
const shuffleArray_1 = require("@/utils/shuffleArray");
class UserService {
    static findAll(_a, userId_1) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 20, offset = 0 }, userId) {
            const where = { id: { not: userId } };
            const [users, count] = yield prismaClient_1.prisma.$transaction([
                models_1.User.findMany({
                    skip: offset,
                    take: limit,
                    where,
                    orderBy: [{ createdAt: "desc" }, { username: "asc" }],
                    select: (0, userSelect_1.userSelectWithFilterCount)(userId),
                }),
                models_1.User.count({ where }),
            ]);
            return [users.map((user) => this.format(user)), count];
        });
    }
    static suggestion(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // User that doesnt followed by us
            const users = yield models_1.User.findMany({
                where: {
                    followers: {
                        every: {
                            followerId: { not: userId },
                        },
                    },
                },
                take: 10,
                orderBy: [{ createdAt: "desc" }, { username: "asc" }],
                select: (0, userSelect_1.userSelectWithFilterCount)(userId),
            });
            // User who following user that we follow and doesnt followed by us
            const users2 = yield models_1.User.findMany({
                where: { followers: { some: { followerId: userId } } },
                select: {
                    followers: {
                        where: {
                            follower: {
                                followers: { every: { followerId: { not: userId } } },
                                id: { not: userId },
                            },
                        },
                        select: { follower: { select: (0, userSelect_1.userSelectWithFilterCount)(userId) } },
                        take: 10,
                        orderBy: [{ createdAt: "desc" }, { follower: { username: "asc" } }],
                    },
                },
                orderBy: [{ createdAt: "desc" }, { username: "asc" }],
                take: 5,
            });
            return (0, shuffleArray_1.shuffleArray)([
                ...users.map((user) => this.format(user)),
                ...users2.flatMap((user) => user.followers.map((follow) => this.format(follow.follower))),
            ]);
        });
    }
    static find(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findUnique({
                where: { id },
                select: Object.assign(Object.assign({}, (0, userSelect_1.userSelectWithFilterCount)(userId)), { bio: true }),
            });
            if (!user)
                throw new error_1.NotFoundError(consts_1.ERROR_MESSAGE.userNotFound);
            return this.format(user);
        });
    }
    static findBy(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, throwWhenNotFound = true) {
            const where = { [key]: value };
            const user = yield models_1.User.findFirst({
                where,
                select: userSelect_1.userSelect,
            });
            if (!user && throwWhenNotFound)
                throw new error_1.NotFoundError(consts_1.ERROR_MESSAGE.userNotFound);
            return user;
        });
    }
    static search(q_1, _a, userId_1) {
        return __awaiter(this, arguments, void 0, function* (q, { limit, offset }, userId) {
            var _b;
            const s = `%${q}%`;
            const ids = yield prismaClient_1.prisma.$queryRaw `SELECT id FROM "users" 
      WHERE CONCAT_WS(' ',"firstName","lastName") ILIKE ${s} OR 
      "username" ILIKE ${s} 
      LIMIT ${limit} OFFSET ${offset}`;
            const c = yield prismaClient_1.prisma.$queryRaw `SELECT COUNT(id) FROM "users"
      WHERE CONCAT_WS(' ',"firstName","lastName")
      ILIKE ${s} OR "username" ILIKE ${s}`;
            const where = {
                id: { in: [...ids.map((u) => u.id)] },
            };
            const users = yield models_1.User.findMany({
                where,
                orderBy: [{ createdAt: "desc" }, { username: "asc" }],
                select: (0, userSelect_1.userSelectWithFilterCount)(userId),
            });
            return [
                users.map((user) => this.format(user)),
                Number((_b = c === null || c === void 0 ? void 0 : c[0]) === null || _b === void 0 ? void 0 : _b.count),
            ];
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, username } = data, restData = __rest(data, ["password", "email", "username"]);
            const [user, user2] = yield prismaClient_1.prisma.$transaction([
                models_1.User.count({ where: { email } }),
                models_1.User.count({ where: { username } }),
            ]);
            if (user)
                throw new error_1.RequestError("Email already taken.", 400);
            if (user2)
                throw new error_1.RequestError("username already taken.", 400);
            const hashedPassword = yield (0, hash_1.hash)(password);
            return yield models_1.User.create({
                data: Object.assign({ password: hashedPassword, email, username }, restData),
                select: userSelect_1.userBaseSelect,
            });
        });
    }
    static update(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.find(id);
            const user = yield models_1.User.findFirst({
                where: { username: (_a = newData === null || newData === void 0 ? void 0 : newData.username) !== null && _a !== void 0 ? _a : "" },
            });
            if (user && user.id !== id)
                throw new error_1.RequestError("username already taken.", 400);
            let hashedPassword;
            if (newData.password) {
                hashedPassword = yield (0, hash_1.hash)(newData.password);
            }
            return yield models_1.User.update({
                data: Object.assign(Object.assign({}, newData), { password: hashedPassword ? hashedPassword : undefined }),
                where: { id },
                select: userSelect_1.userSelect,
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.find(id);
            return yield models_1.User.delete({ where: { id }, select: userSelect_1.userSelect });
        });
    }
    static follow(followerId, followedId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followedId === followerId)
                return false;
            const user = yield this.find(followedId, followerId);
            if (user.isFollowed)
                return false;
            yield models_1.Followings.create({
                data: { followerId, followedId },
            });
            return true;
        });
    }
    static unfollow(followerId, followedId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followerId === followedId)
                return false;
            const user = yield this.find(followedId, followerId);
            if (!user.isFollowed)
                return false;
            yield models_1.Followings.delete({
                where: { followerId_followedId: { followedId, followerId } },
            });
            return true;
        });
    }
    static findFollowings(userId_1, currentUserId_1, type_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, currentUserId, type, { limit, offset }) {
            // isFollowing === true = followed user
            // isFollowing === false = user followers
            // followedId = user that follow
            // followerId = user that are followed
            const isFollowing = type === "following";
            const where = isFollowing
                ? {
                    followerId: userId,
                }
                : {
                    followedId: userId,
                };
            const select = isFollowing
                ? {
                    followed: { select: (0, userSelect_1.userSelectWithFilterCount)(currentUserId) },
                }
                : {
                    follower: { select: (0, userSelect_1.userSelectWithFilterCount)(currentUserId) },
                };
            const [users, count] = yield prismaClient_1.prisma.$transaction([
                models_1.Followings.findMany({
                    where,
                    take: limit,
                    skip: offset,
                    select,
                    orderBy: [
                        { createdAt: "desc" },
                        { [isFollowing ? "followerId" : "followedId"]: "desc" },
                    ],
                }),
                models_1.Followings.count({ where }),
            ]);
            return [
                users.map((user) => this.format(Object.assign({}, user[isFollowing ? "followed" : "follower"]))),
                count,
            ];
        });
    }
    static format(user) {
        var _a, _b;
        return Object.assign(Object.assign({}, (0, omitProperties_1.omitProperties)(user, ["followers"])), { isFollowed: ((_b = (_a = user === null || user === void 0 ? void 0 : user.followers) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.followerId) ? true : false });
    }
    static getRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            return user === null || user === void 0 ? void 0 : user.role;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map