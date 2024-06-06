import { NextFunction, Request, Response } from "express";
import { formatLogger, httpLogger } from "@/libs/logger";
import { NODE_ENV } from "@/libs/consts";

const DISABLE_LOGGING = false;

export const loggerInterceptors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalResJson = res.json;

  let resSended = false;

  if (NODE_ENV !== "development" || DISABLE_LOGGING) return next();
  httpLogger.profile("response");
  res.json = function (body: any): Response {
    if (!resSended) {
      if (res.statusCode < 400) {
        httpLogger.profile("response", {
          ...formatLogger(req, res, body),
          level: "http",
        });
      } else {
        httpLogger.profile("response", {
          ...formatLogger(req, res, body),
          level: "error",
        });
      }
      resSended = true;
    }
    return originalResJson.call(this, body);
  };

  next();
};
