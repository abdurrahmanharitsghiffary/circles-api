import { CONFIG } from "@/config";
import { redisClient } from "@/libs/redisClient";
import { ApiResponse } from "@/libs/response";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

export const signInLimiter = rateLimit({
  windowMs: 1000 * 60 * 30,
  limit: 5,
  message: new ApiResponse(
    null,
    429,
    "Too many failed sign-in attempts from this device. Please wait for 30 minutes before trying again."
  ),
  skipSuccessfulRequests: true,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "sign_in",
  }),
});

export const signUpLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60 * 24,
  skipFailedRequests: true,
  message: new ApiResponse(
    null,
    429,
    "Too many registration attempts from this device. Please wait for 1 day before trying again."
  ),
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "sign_up",
  }),
});

export const refreshTokenLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60,
  message: new ApiResponse(
    null,
    429,
    "Too many request attempts to refresh access token, please wait for 1 hour to refresh your access token."
  ),
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "rt",
  }),
});

export const forgotPasswordLimiter = rateLimit({
  limit: 5,
  windowMs: 1000 * 60 * 60 * 12,
  message: new ApiResponse(
    null,
    429,
    "Too many request attemps from this device, please wait for 12 hours to make another forgot password request."
  ),
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "fgpw",
  }),
});

export const apiLimiter = rateLimit({
  limit: CONFIG.INFINITY_LIMITER ? Infinity : 100,
  windowMs: 1000 * 60 * 10,
  // keyGenerator: (req) => {
  //   const ip = req.clientIp;
  //   const userId = `${req?.auth?.user?.id}${ip}`;
  //   return userId?.toString() ?? ip;
  // },
  message: new ApiResponse(
    null,
    429,
    "Rate limit reached. Please wait for 10 minutes before trying to make a request again."
  ),
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "base",
  }),
});
