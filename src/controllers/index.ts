import { NextFunction, Request, Response } from "express";
import { ApiPagingResponse } from "../libs/response";

type HandlerResponse<T> = Promise<Response<ApiPagingResponse<T>>>;

type Handler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;

class BaseController {
  async index<T>(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<T[]> {
    return {} as any;
  }
  async show<T>(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<T> {
    return {} as any;
  }
  async store<T>(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<T> {
    return {} as any;
  }
  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<null> {
    return {} as any;
  }
  async destroy(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<null> {
    return {} as any;
  }
  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): HandlerResponse<any> {
    return {} as any;
  }
}

export class Controller extends BaseController {
  static use(key: keyof Controller) {
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
