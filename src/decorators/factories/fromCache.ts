import { CONFIG } from "@/config";
import { MiddlewareDecorator } from "..";
import { redisClient } from "@/libs/redisClient";
import { AppRequest } from "@/types/express";

type Cb<T> = (req: AppRequest) => T;

export function FromCache(redisKey: Cb<string> | string) {
  return MiddlewareDecorator(async function (req, res, next) {
    const key = typeof redisKey === "string" ? redisKey : redisKey(req);
    req.requestedCacheKey = key;
    const cache = await redisClient.get(key);
    if (cache && !CONFIG.DISABLE_CACHE) {
      console.log("FROM CACHE");
      return res.json(JSON.parse(cache));
    }

    return next();
  });
}
