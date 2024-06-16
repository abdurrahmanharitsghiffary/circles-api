import { AppRequest, AppResponse } from "@/types/express";
import { NextFunction } from "express";

export function TryCatch() {
  return function (
    target: object,
    propName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: AppRequest,
      res: AppResponse,
      next: NextFunction
    ) {
      try {
        await originalMethod.call(this, req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };
}
