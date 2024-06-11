import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "@/libs/response";
import Joi from "joi";
import { NODE_ENV } from "@/config/env";
import { JsonWebTokenError } from "jsonwebtoken";

export class ErrorMiddleware {
  static async handle(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const status = (err as any)?.status || 400;
      const message = (err as any)?.message || "Something went wrong.";
      const name = NODE_ENV === "development" ? (err as any)?.name : undefined;

      if (err instanceof Joi.ValidationError) {
        return res
          .status(422)
          .json(new ApiResponse(null, 422, message, name, err?.details));
      } else if (err instanceof JsonWebTokenError) {
        if (name === "TokenExpiredError") {
          return res
            .status(401)
            .json(new ApiResponse(null, 401, "Access token expired.", name));
        }
        return res
          .status(401)
          .json(new ApiResponse(null, 401, "Invalid token.", name));
      }

      return res
        .status(status)
        .json(new ApiResponse(null, status, message, name));
    } catch (err) {
      res
        .status(500)
        .json(new ApiResponse(null, 500, "Internal Server Error!"));
    }
  }
}
