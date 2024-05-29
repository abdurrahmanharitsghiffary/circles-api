import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../libs/response";
import { RequestError } from "../libs/error";

export class ErrorMiddleware {
  static async handle(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const status = (err as any)?.status || 404;
    const message = (err as any)?.message || "Something went wrong.";

    try {
      if (err instanceof RequestError) {
        return res
          .status(err?.status)
          .json(new ApiResponse(null, status, message));
      }
      return res.status(status).json(new ApiResponse(null, status, message));
    } catch (err) {
      res
        .status(500)
        .json(new ApiResponse(null, 500, "Internal Server Error!"));
    }
  }
}
