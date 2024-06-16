/* eslint-disable @typescript-eslint/ban-types */
import { AppRequest, AppResponse } from "@/types/express";
import { NextFunction } from "express";

class Next extends Error {
  constructor() {
    super();
    this.name = "Next";
  }
}

export function DecorateAll(
  decorator: MethodDecorator,
  blackListedPropName: string[] = []
) {
  return (target: Function) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod = descriptor.value instanceof Function;
      if (!isMethod) continue;
      if (!blackListedPropName.includes(propName)) {
        decorator(target, propName, descriptor);
        Object.defineProperty(target.prototype, propName, descriptor);
      }
    }
  };
}

export function MethodDecorator(cb: Function) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      await cb(...args);
      await original.call(this, ...args);
    };
  };
}

export function MiddlewareDecorator(
  cb: (
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ) => Promise<unknown>
) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (
      req: AppRequest,
      res: AppResponse,
      next: NextFunction
    ) {
      try {
        await cb(req, res, (err: unknown) => {
          if (err) return next(err);
          throw new Next();
        });
        return;
      } catch (err) {
        if (res.headersSent) return;
        if (err instanceof Next)
          return await original.call(this, req, res, next);
        throw err;
      }
    };
  };
}
