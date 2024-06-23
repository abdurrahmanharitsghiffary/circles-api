"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZFromCache = exports.FromCache = void 0;
const config_1 = require("@/config");
const redisClient_1 = require("@/libs/redisClient");
const response_1 = require("@/libs/response");
const middleware_1 = require("./middleware");
function FromCache(redisKey) {
    return (0, middleware_1.Middleware)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.CONFIG.DISABLE_CACHE)
                return next();
            const key = typeof redisKey === "string" ? redisKey : redisKey(req);
            req.requestedCacheKey = key;
            const cache = yield redisClient_1.redisClient.get(key);
            if (cache) {
                return res.json(JSON.parse(cache));
            }
            return next();
        });
    });
}
exports.FromCache = FromCache;
function ZFromCache(redisKey) {
    return (0, middleware_1.Middleware)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.CONFIG.DISABLE_CACHE)
                return next();
            const { limit, offset } = req.pagination;
            const key = typeof redisKey === "string" ? redisKey : redisKey(req);
            req.requestedCacheKey = key;
            const cachedDatas = yield redisClient_1.redisClient.zRangeByScore(key, offset, offset + limit);
            const totalRecords = yield redisClient_1.redisClient.get(`${key}:COUNT`);
            const isLastPage = Number(totalRecords) - offset <= limit;
            if (cachedDatas.length === limit || isLastPage) {
                return res.json(new response_1.ApiPagingResponse(req, cachedDatas.map((data) => JSON.parse(data)), Number(totalRecords)));
            }
            return next();
        });
    });
}
exports.ZFromCache = ZFromCache;
//# sourceMappingURL=fromCache.js.map