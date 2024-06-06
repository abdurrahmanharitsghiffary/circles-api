import { Request } from "express";
import { MethodDecorator } from "..";
import { AuthService } from "@/services/auth";
import { NotFoundError, UnauthorizedError } from "@/libs/error";
import { getParamsId } from "@/utils/getParamsId";
import { ERROR_MESSAGE } from "@/libs/consts";
import * as Model from "@/models";
import { Prisma } from "@prisma/client";
import { upperFirstCase } from "@/utils/upperFirstCase";

export function Authorize(
  { isOptional }: { isOptional: boolean } = { isOptional: false }
) {
  return MethodDecorator(async (req: Request) => {
    await AuthService.verifyAuth(req, isOptional);
  });
}

export function AdminOnly() {
  return MethodDecorator(async (req: Request) => {
    if (req?.auth?.user?.role !== "ADMIN")
      throw new UnauthorizedError("Only ADMIN can access this endpoint.");
  });
}

export function OwnerOnly<T = Prisma.PrismaPromise<any>>(
  prismaPromise: (id: number | null) => T,
  ownerIdKey: keyof Awaited<T>,
  resourceKey: string,
  paramsKey: string = "id"
) {
  return MethodDecorator(async (req: Request) => {
    const id = getParamsId(req, paramsKey);
    console.log(id);
    const awaited = await prismaPromise(id);
    if (!awaited)
      throw new NotFoundError(
        ERROR_MESSAGE.notFound(upperFirstCase(resourceKey))
      );
    if (req?.auth?.user?.id !== awaited[ownerIdKey])
      throw new UnauthorizedError(ERROR_MESSAGE.unauthoredModify(resourceKey));
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
