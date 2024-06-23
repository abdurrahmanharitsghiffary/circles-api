"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resJsonRedis = void 0;
const config_1 = require("@/config");
const redisClient_1 = require("@/libs/redisClient");
const resJsonRedis = (baseOptions) => (req, res, next) => {
    const { offset } = req.pagination;
    const originalResJson = res.json;
    if (config_1.CONFIG.DISABLE_CACHE)
        return next();
    res.json = function (body) {
        var _a;
        const _b = body || {}, { cacheKey, cacheOptions, zAdd, zAddOptions } = _b, rest = __rest(_b, ["cacheKey", "cacheOptions", "zAdd", "zAddOptions"]);
        if (cacheKey && !zAdd) {
            redisClient_1.redisClient
                .set(cacheKey, JSON.stringify(rest), cacheOptions ? cacheOptions : baseOptions)
                .then((res) => {
                console.log(res, "SAVED TO CACHE");
            })
                .catch((err) => {
                console.error(err, "ERROR WHEN SAVING TO CACHE");
            });
        }
        if (zAdd && body.data instanceof Array) {
            const zMembers = body.data.map((v, i) => ({
                score: offset + i,
                value: JSON.stringify(v),
            }));
            redisClient_1.redisClient.set(`${cacheKey}:COUNT`, (_a = body === null || body === void 0 ? void 0 : body.meta) === null || _a === void 0 ? void 0 : _a.totalRecords);
            redisClient_1.redisClient
                .zAdd(cacheKey, zMembers, zAddOptions)
                .then((res) => console.log("ZADDSUCCESS", res))
                .catch((err) => console.error("ZADDERR:", err));
        }
        return originalResJson.call(this, rest);
    };
    return next();
};
exports.resJsonRedis = resJsonRedis;
//# sourceMappingURL=resJsonRedis.js.map