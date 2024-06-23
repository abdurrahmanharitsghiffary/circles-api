import { TYPES } from "@/libs/consts";
import { AppHandler } from "@/types/express";

export function Middleware(middleware: AppHandler) {
  return function (...args: unknown[]) {
    if (args.length === 3) {
      const [target, propName] = args as [
        target: Function,
        propName: string,
        descriptor: PropertyDescriptor
      ];

      const middlewares =
        Reflect.getMetadata(TYPES.MIDDLEWARES, target, propName) || [];
      middlewares.unshift(middleware);

      Reflect.defineMetadata(TYPES.MIDDLEWARES, middlewares, target, propName);
    } else if (args.length === 1) {
      const [target] = args as [target: Function];

      const middlewares = Reflect.getMetadata(TYPES.MIDDLEWARES, target) || [];

      middlewares.unshift(middleware);

      Reflect.defineMetadata(TYPES.MIDDLEWARES, middlewares, target);
    }
  };
}
