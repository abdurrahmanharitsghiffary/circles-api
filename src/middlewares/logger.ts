import { AppRequest, AppResponse, BaseBody } from "@/types/express";
import { NextFunction } from "express";
import { formatLogger, httpLogger } from "@/libs/logger";
import { NODE_ENV } from "@/config/env";
import { CONFIG } from "@/config";

export const apiLogger = (
  req: AppRequest,
  res: AppResponse,
  next: NextFunction
) => {
  const originalResJson = res.json;
  const ip = req.clientIp;
  let resSended = false;

  if (NODE_ENV !== "development" || !CONFIG.ENABLE_LOGGING) return next();
  httpLogger.profile("response");
  res.json = function (body: BaseBody): AppResponse {
    if (!resSended) {
      if (res.statusCode < 400) {
        httpLogger.profile("response", {
          ...formatLogger(req, res, body),
          level: "http",
          ip,
        });
      } else {
        httpLogger.profile("response", {
          ...formatLogger(req, res, body),
          level: "error",
          ip,
        });
      }
      resSended = true;
    }
    return originalResJson.call(this, body);
  };

  next();
};
