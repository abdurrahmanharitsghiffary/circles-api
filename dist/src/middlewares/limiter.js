"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.forgotPasswordLimiter = exports.refreshTokenLimiter = exports.signUpLimiter = exports.signInLimiter = void 0;
const config_1 = require("@/config");
const redisClient_1 = require("@/libs/redisClient");
const response_1 = require("@/libs/response");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
exports.signInLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000 * 60 * 30,
    limit: 5,
    message: new response_1.ApiResponse(null, 429, "Too many failed sign-in attempts from this device. Please wait for 30 minutes before trying again."),
    skipSuccessfulRequests: true,
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.redisClient.sendCommand(args),
        prefix: "sign_in",
    }),
});
exports.signUpLimiter = (0, express_rate_limit_1.default)({
    limit: 5,
    windowMs: 1000 * 60 * 60 * 24,
    skipFailedRequests: true,
    message: new response_1.ApiResponse(null, 429, "Too many registration attempts from this device. Please wait for 1 day before trying again."),
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.redisClient.sendCommand(args),
        prefix: "sign_up",
    }),
});
exports.refreshTokenLimiter = (0, express_rate_limit_1.default)({
    limit: 10,
    windowMs: 1000 * 60 * 60,
    message: new response_1.ApiResponse(null, 429, "Too many request attempts to refresh access token, please wait for 1 hour to refresh your access token."),
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.redisClient.sendCommand(args),
        prefix: "rt",
    }),
});
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    limit: 5,
    windowMs: 1000 * 60 * 60 * 12,
    message: new response_1.ApiResponse(null, 429, "Too many request attemps from this device, please wait for 12 hours to make another forgot password request."),
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.redisClient.sendCommand(args),
        prefix: "fgpw",
    }),
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    limit: config_1.CONFIG.INFINITY_LIMITER ? Infinity : 100,
    windowMs: 1000 * 60 * 10,
    // keyGenerator: (req) => {
    //   const ip = req.clientIp;
    //   const userId = `${req?.auth?.user?.id}${ip}`;
    //   return userId?.toString() ?? ip;
    // },
    message: new response_1.ApiResponse(null, 429, "Rate limit reached. Please wait for 10 minutes before trying to make a request again."),
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.redisClient.sendCommand(args),
        prefix: "base",
    }),
});
//# sourceMappingURL=limiter.js.map