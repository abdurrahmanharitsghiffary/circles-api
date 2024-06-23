"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSelectWithFilterCount = exports.userSelect = exports.userBaseSelect = void 0;
exports.userBaseSelect = {
    id: true,
    firstName: true,
    lastName: true,
    coverPicture: true,
    photoProfile: true,
    username: true,
    _count: { select: { followers: true, following: true } },
};
exports.userSelect = Object.assign(Object.assign({}, exports.userBaseSelect), { bio: true, email: true, password: true, role: true });
const userSelectWithFilterCount = (userId) => (Object.assign(Object.assign({}, exports.userBaseSelect), { followers: {
        select: { followerId: true },
        where: { followerId: userId || -1 },
        take: 1,
    } }));
exports.userSelectWithFilterCount = userSelectWithFilterCount;
// import { prisma } from "@/libs/prismaClient";
// import { Prisma } from "@prisma/client";
// type ExtendFullName<T> = Omit<T, "fullName"> & { fullName: string };
// type UserSelect = Prisma.Args<typeof prisma.user, "findUnique">["select"];
// export const userBaseSelect = {
//   id: true,
//   firstName: true,
//   lastName: true,
//   coverPicture: true,
//   photoProfile: true,
//   fullName: true as true,
//   username: true,
//   _count: { select: { followers: true, following: true } },
// } satisfies UserSelect;
// export type UserBaseSelectPayload = ExtendFullName<
//   Prisma.UserGetPayload<{
//     select: typeof userBaseSelect;
//   }>
// >;
// export const userSelect = {
//   ...userBaseSelect,
//   bio: true,
//   email: true,
//   password: true,
//   role: true,
// } satisfies UserSelect;
// export type UserSelectPayload = ExtendFullName<
//   Prisma.UserGetPayload<{
//     select: typeof userSelect;
//   }>
// >;
// export const userSelectWithFilterCount = (userId?: number) =>
//   ({
//     ...userBaseSelect,
//     followers: {
//       select: { followerId: true },
//       where: { followerId: userId },
//       take: 1,
//     },
//   } satisfies UserSelect);
// export type UserSelectWithFilterCountPayload = ExtendFullName<
//   Prisma.UserGetPayload<{
//     select: ReturnType<typeof userSelectWithFilterCount>;
//   }>
// >;
//# sourceMappingURL=userSelect.js.map