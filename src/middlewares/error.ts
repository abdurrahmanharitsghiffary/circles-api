import { NextFunction } from "express";
import { ApiResponse } from "@/libs/response";
import Joi from "joi";
import { ENV, NODE_ENV } from "@/config/env";
import { JsonWebTokenError } from "jsonwebtoken";
import { AppRequest, AppResponse } from "@/types/express";
import { RequestError, VerifyOAuthError } from "@/libs/error";

export class ErrorMiddleware {
  static async handle(
    err: unknown,
    req: AppRequest,
    res: AppResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) {
    try {
      const status = (err as RequestError)?.status || 400;
      const message = (err as RequestError)?.message || "Something went wrong.";
      const name =
        NODE_ENV === "development" ? (err as RequestError)?.name : undefined;

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
      } else if (err instanceof VerifyOAuthError) {
        const url = new URL("/auth/sign-in", ENV.CLIENT_BASE_URL);
        url.searchParams.set("err", err?.message);
        return res.redirect(url.href);
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
