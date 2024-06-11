import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prismaClient";
import { RefreshToken } from "@/models";
import { CreateRefreshTokenOptions } from "@/types/refreshToken";

export class RefreshTokenService {
  static async findAll(userId: number) {
    const where = { userId } satisfies Prisma.RefreshTokenWhereInput;
    const [tokens, count] = await prisma.$transaction([
      RefreshToken.findMany({ where }),
      RefreshToken.count({ where }),
    ]);

    return [tokens, count];
  }

  static async find(token: string) {
    return await RefreshToken.findUnique({ where: { token } });
  }

  static async create({ token, userId, expiresAt }: CreateRefreshTokenOptions) {
    return await RefreshToken.create({
      data: {
        token,
        userId,
        expiresAt: expiresAt ?? 1000 * 60 * 60 * 24 * 7,
      },
    });
  }

  static async delete(token: string) {
    const refreshToken = await this.find(token);
    if (!refreshToken) return false;
    await RefreshToken.delete({ where: { token } });
    return true;
  }
}
