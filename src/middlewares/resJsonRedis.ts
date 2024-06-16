import { redisClient } from "@/libs/redisClient";
import { AppRequest, AppResponse, BaseBody } from "@/types/express";
import { NextFunction, Response } from "express";
import { SetOptions } from "redis";

export const resJsonRedis =
  (baseOptions?: SetOptions) =>
  (req: AppRequest, res: AppResponse, next: NextFunction) => {
    const originalResJson = res.json;
    let resSended = false;

    res.json = function (body?: BaseBody): Response {
      const { cacheKey, cacheOptions, ...rest } = body || {};

      if (cacheKey && !resSended) {
        redisClient
          .set(
            cacheKey,
            JSON.stringify(rest),
            cacheOptions ? cacheOptions : baseOptions
          )
          .then((res) => {
            console.log(res, "SAVED TO CACHE");
          })
          .catch((err) => {
            console.error(err, "ERROR WHEN SAVING TO CACHE");
          });
        resSended = true;
      }
      return originalResJson.call(this, rest);
    };

    return next();
  };
