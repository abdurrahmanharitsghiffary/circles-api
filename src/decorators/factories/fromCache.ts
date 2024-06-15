import { MiddlewareDecorator } from "..";
import { redisClient } from "@/libs/redisClient";
import { AppRequest } from "@/types/express";

type Cb<T> = (req: AppRequest) => T;

export function FromCache(redisKey: Cb<string> | string) {
  return MiddlewareDecorator(async function (req, res, next) {
    const key = typeof redisKey === "string" ? redisKey : redisKey(req);
    const cache = await redisClient.get(key);
    if (cache) {
      console.log("FROM CACHE");
      return res.json(JSON.parse(cache));
    }

    return next();
  });
}
