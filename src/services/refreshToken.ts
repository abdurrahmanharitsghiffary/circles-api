import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prismaClient";
import { RefreshToken } from "@/models";
import { encrypt } from "@/utils/encrypt";

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

  static async create(token: string, userId: number, ip: string) {
    const encryptedIp = await encrypt(ip);
    return await RefreshToken.create({
      data: {
        ipv6: encryptedIp,
        token,
        userId,
        ipv4: encryptedIp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
