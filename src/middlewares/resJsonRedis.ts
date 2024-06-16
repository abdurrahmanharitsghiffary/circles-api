import { CONFIG } from "@/config";
import { redisClient } from "@/libs/redisClient";
import { AppRequest, AppResponse, BaseBody } from "@/types/express";
import { ZMember } from "@/types/redis";
import { NextFunction, Response } from "express";
import { SetOptions } from "redis";

export const resJsonRedis =
  (baseOptions?: SetOptions) =>
  (req: AppRequest, res: AppResponse, next: NextFunction) => {
    const { offset } = req.pagination;
    const originalResJson = res.json;

    if (CONFIG.DISABLE_CACHE) return next();

    res.json = function (body?: BaseBody): Response {
      const { cacheKey, cacheOptions, zAdd, zAddOptions, ...rest } = body || {};

      if (cacheKey && !zAdd) {
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
      }
      if (zAdd && body.data instanceof Array) {
        const zMembers: ZMember[] = body.data.map((v: unknown, i: number) => ({
          score: offset + i,
          value: JSON.stringify(v),
        }));

        redisClient.set(`${cacheKey}:COUNT`, body?.meta?.totalRecords);

        redisClient
          .zAdd(cacheKey, zMembers, zAddOptions)
          .then((res) => console.log("ZADDSUCCESS", res))
          .catch((err) => console.error("ZADDERR:", err));
      }

      return originalResJson.call(this, rest);
    };

    return next();
  };
