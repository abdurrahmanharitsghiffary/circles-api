import { AuthService } from "@/services/authService";
import { NotFoundError, UnauthorizedError } from "@/libs/error";
import { getParamsId } from "@/utils/getParamsId";
import { ERROR_MESSAGE } from "@/libs/consts";
import * as Model from "@/models";
import { Prisma } from "@prisma/client";
import { upperFirstCase } from "@/utils/upperFirstCase";
import { Middleware } from "./middleware";

export function Authorize(
  { isOptional }: { isOptional: boolean } = { isOptional: false }
) {
  return Middleware(async (req, res, next) => {
    await AuthService.verifyAuth(req, next, isOptional);
  });
}

export function AdminOnly() {
  return Middleware(async (req, res, next) => {
    if (req?.auth?.user?.role !== "ADMIN")
      throw new UnauthorizedError("Only ADMIN can access this endpoint.");

    return next();
  });
}

export function OwnerOnly<T = Prisma.PrismaPromise<unknown>>(
  prismaPromise: (id: number | null) => T,
  ownerIdKey: keyof Awaited<T>,
  resourceKey: string,
  paramsKey: string = "id"
) {
  return Middleware(async (req, res, next) => {
    const id = getParamsId(req, paramsKey);
    const awaited = await prismaPromise(id);
    if (!awaited)
      throw new NotFoundError(
        ERROR_MESSAGE.notFound(upperFirstCase(resourceKey))
      );
    if (req?.auth?.user?.id !== awaited[ownerIdKey])
      throw new UnauthorizedError(ERROR_MESSAGE.unauthoredModify(resourceKey));

    return next();
  });
}

export const ThreadOwnerOnly = () =>
  OwnerOnly(
    (id) => Model.Thread.findFirst({ where: { id } }),
    "authorId",
    "thread"
  );

export const ReplyOwnerOnly = () =>
  OwnerOnly(
    (id) => Model.Reply.findUnique({ where: { id } }),
    "authorId",
    "reply"
  );
