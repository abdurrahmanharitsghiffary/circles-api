import { ERROR_MESSAGE } from "@/libs/consts";
import { NotFoundError, RequestError } from "@/libs/error";
import { Followings, User } from "@/models";
import { PaginationBase } from "@/types/pagination";
import { prisma } from "@/libs/prismaClient";
import {
  UserBaseSelectPayload,
  UserSelectWithFilterCountPayload,
  userBaseSelect,
  userSelect,
  userSelectWithFilterCount,
} from "@/query/select/userSelect";
import { UserCreateDTO, UserUpdateDTO } from "@/types/user-dto";
import { hash } from "@/libs/hash";
import { Prisma } from "@prisma/client";
import { omitProperties } from "@/utils/omitProperties";

class UserService {
  static async findAll(
    { limit = 20, offset = 0 }: PaginationBase,
    userId?: number
  ) {
    const where = { id: { not: userId } } satisfies Prisma.UserWhereInput;
    const [users, count] = await prisma.$transaction([
      User.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: [{ createdAt: "desc" }, { username: "asc" }],
        select: userSelectWithFilterCount(userId),
      }),
      User.count({ where }),
    ]);
    return [users.map((user) => this.format(user)), count] as const;
  }

  static async find(id: UserBaseSelectPayload["id"], userId?: number) {
    const user = await User.findUnique({
      where: { id },
      select: userSelectWithFilterCount(userId),
    });
    if (!user) throw new NotFoundError(ERROR_MESSAGE.userNotFound);
    return this.format(user);
  }

  static async create(data: UserCreateDTO) {
    const { password, email, username, ...restData } = data;

    const [user, user2] = await prisma.$transaction([
      User.count({ where: { email } }),
      User.count({ where: { username } }),
    ]);

    if (user) throw new RequestError("Email already taken.", 400);
    if (user2) throw new RequestError("username already taken.", 400);

    const hashedPassword = await hash(password);
    return await User.create({
      data: { password: hashedPassword, email, username, ...restData },
      select: userBaseSelect,
    });
  }

  static async update(id: UserBaseSelectPayload["id"], newData: UserUpdateDTO) {
    await this.find(id);
    const user = await User.findFirst({
      where: { username: newData?.username ?? "" },
    });

    if (user) throw new RequestError("username already taken.", 400);

    return await User.update({
      data: { ...newData },
      where: { id },
      select: userBaseSelect,
    });
  }

  static async delete(id: UserBaseSelectPayload["id"]) {
    await this.find(id);
    return await User.delete({ where: { id }, select: userBaseSelect });
  }

  static async findBy<T extends keyof Prisma.UserWhereUniqueInput>(
    key: T,
    value: Prisma.UserWhereUniqueInput[T],
    throwWhenNotFound: boolean = true
  ) {
    const where = { [key]: value } satisfies Prisma.UserWhereInput;
    const user = await User.findFirst({
      where,
      select: userSelect,
    });
    if (!user && throwWhenNotFound)
      throw new NotFoundError(ERROR_MESSAGE.userNotFound);
    return user;
  }

  static async follow(followerId: number, followedId: number) {
    if (followedId === followerId) return false;
    const user = await this.find(followedId, followerId);
    if (user.isFollowed) return false;

    await Followings.create({
      data: { followerId, followedId },
    });

    return true;
  }

  static async unfollow(followerId: number, followedId: number) {
    if (followerId === followedId) return false;
    const user = await this.find(followedId, followerId);
    if (!user.isFollowed) return false;

    await Followings.delete({
      where: { followerId_followedId: { followedId, followerId } },
    });

    return true;
  }

  static async findFollowings(
    userId: number,
    type: "following" | "followers",
    { limit, offset }: PaginationBase
  ) {
    const isFollowing = type === "following";

    const where = isFollowing
      ? ({
          followerId: userId,
        } satisfies Prisma.FollowingsWhereInput)
      : ({
          followedId: userId,
        } satisfies Prisma.FollowingsWhereInput);

    const select = isFollowing
      ? ({
          followed: { select: userBaseSelect },
        } satisfies Prisma.FollowingsSelect)
      : ({
          follower: { select: userBaseSelect },
        } satisfies Prisma.FollowingsSelect);

    const [users, count] = await prisma.$transaction([
      Followings.findMany({
        where,
        take: limit,
        skip: offset,
        select,
        orderBy: [{ createdAt: "desc" }],
      }),
      Followings.count({ where }),
    ]);

    return [
      users.map((user) => ({
        ...user[isFollowing ? "followed" : "follower"],
        isFollowed: isFollowing,
      })) as UserBaseSelectPayload[],
      count,
    ] as const;
  }

  static format(user: UserSelectWithFilterCountPayload) {
    return {
      ...omitProperties(user, ["followers"]),
      isFollowed: user?.followers?.[0]?.followerId ? true : false,
    };
  }

  static async getRole(userId: number) {
    const user = await User.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role;
  }
}

export default UserService;
