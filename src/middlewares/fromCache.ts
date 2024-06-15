import { redisClient } from "@/libs/redisClient";
import { AppRequest, AppResponse, BaseBody } from "@/types/express";
import { NextFunction, Response } from "express";

export const fromCache =
  () => (req: AppRequest, res: AppResponse, next: NextFunction) => {
    const originalResJson = res.json;

    res.json = function (body?: BaseBody): Response {
      const { cacheKey, cacheOptions, ...rest } = body || {};

      if (cacheKey) {
        redisClient
          .set(cacheKey, JSON.stringify(rest), cacheOptions)
          .then((res) => {
            console.log(res, "SAVED TO CACHE");
          })
          .catch((err) => {
            console.error(err, "ERROR WHEN SAVING TO CACHE");
          });
      }

      return originalResJson.call(this, rest);
    };

    return next();
  };
