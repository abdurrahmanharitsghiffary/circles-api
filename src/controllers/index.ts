/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRequest, AppResponse } from "@/types/express";
import { NextFunction, Response } from "express";
import { ApiPagingResponse } from "@/libs/response";

type HandlerResponse<T> = Promise<Response<ApiPagingResponse<T>>>;

type Handler = (
  req: AppRequest,
  res: AppResponse,
  next?: NextFunction
) => Promise<any>;

abstract class BaseController {
  async index<T>(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): HandlerResponse<T[]> {
    return {} as any;
  }
  async show<T>(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): HandlerResponse<T> {
    return {} as any;
  }
  async store<T>(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): HandlerResponse<T> {
    return {} as any;
  }
  async update(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): HandlerResponse<null> {
    return {} as any;
  }
  async destroy(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): HandlerResponse<null> {
    return {} as any;
  }
  async handle(
    req: AppRequest,
    res: AppResponse,
    next: NextFunction
  ): Promise<any> {
    return {} as any;
  }
}

/**
 * @deprecated
 * use the Controller decorator instead
 */
export class Controller extends BaseController {
  static use(key: keyof InstanceType<typeof Controller> | string = "handle") {
    // @ts-expect-error Haiyaaa
    return this.tryCatch(new this()[key]);
  }

  static tryCatch(controller: Handler): Handler {
    return async (req, res, next) => {
      try {
        await controller(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}
