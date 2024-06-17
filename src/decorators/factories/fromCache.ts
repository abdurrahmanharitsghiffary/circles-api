import { CONFIG } from "@/config";
import { redisClient } from "@/libs/redisClient";
import { AppRequest } from "@/types/express";
import { ApiPagingResponse } from "@/libs/response";
import { Middleware } from "./middleware";

type Cb<T> = (req: AppRequest) => T;

export function FromCache(redisKey: Cb<string> | string) {
  return Middleware(async function (req, res, next) {
    if (CONFIG.DISABLE_CACHE) return next();

    const key = typeof redisKey === "string" ? redisKey : redisKey(req);
    req.requestedCacheKey = key;
    const cache = await redisClient.get(key);
    if (cache) {
      return res.json(JSON.parse(cache));
    }

    return next();
  });
}

export function ZFromCache(redisKey: Cb<string> | string) {
  return Middleware(async function (req, res, next) {
    if (CONFIG.DISABLE_CACHE) return next();

    const { limit, offset } = req.pagination;
    const key = typeof redisKey === "string" ? redisKey : redisKey(req);
    req.requestedCacheKey = key;

    const cachedDatas = await redisClient.zRangeByScore(
      key,
      offset,
      offset + limit
    );

    const totalRecords = await redisClient.get(`${key}:COUNT`);
    const isLastPage = Number(totalRecords) - offset <= limit;
    if (cachedDatas.length === limit || isLastPage) {
      return res.json(
        new ApiPagingResponse(
          req,
          cachedDatas.map((data) => JSON.parse(data)),
          Number(totalRecords)
        )
      );
    }

    return next();
  });
}
