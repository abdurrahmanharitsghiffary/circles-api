import { TYPES } from "@/libs/consts";
import { AppHandler } from "@/types/express";

export function Middleware(middleware: AppHandler) {
  return function (
    target: object,
    propName: string,
    descriptor: PropertyDescriptor
  ) {
    const middlewares =
      Reflect.getMetadata(TYPES.MIDDLEWARES, target, propName) || [];
    middlewares.unshift(middleware);
    Reflect.defineMetadata(TYPES.MIDDLEWARES, middlewares, target, propName);
  };
}
