import { Prisma, PrismaClient } from "@prisma/client";

export const extension = Prisma.defineExtension({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          let fullName = user.firstName;
          if (user?.lastName) fullName += ` ${user.lastName}`;
          return fullName;
        },
      },
    },
  },
});

export const prisma = new PrismaClient().$extends(extension);

export type ExtendedPrismaClient = typeof prisma;
